"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { error?: string; success?: string } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FILE_PATH_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.pdf$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MIN_PASSWORD_LENGTH = 8;
const BUCKET = "certificates";

// ---------- Sesión ----------

const INVALID_CREDENTIALS = "Correo o contraseña incorrectos.";

/** Inicia sesión con correo y contraseña y devuelve el rol, o un error genérico. */
async function signInWithPassword(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!EMAIL_RE.test(email) || !password) return { error: "Ingresa tu correo y contraseña." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error?.status === 429) return { error: "Demasiados intentos. Espera unos minutos y vuelve a intentarlo." };
  if (error || !data.user) return { error: INVALID_CREDENTIALS };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
  if (!profile) {
    await supabase.auth.signOut();
    return { error: INVALID_CREDENTIALS };
  }
  return { supabase, role: profile.role as "admin" | "client" };
}

/** Único login del sitio: clientes van a sus certificados y el admin a su panel. */
export async function signInClient(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const result = await signInWithPassword(formData);
  if ("error" in result) return { error: result.error };
  redirect(result.role === "admin" ? "/admin" : "/portal/certificados");
}

/** Registro libre de clientes. Requiere "Confirm email" desactivado en Supabase. */
export async function signUpClient(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const fullName = String(formData.get("full_name") ?? "").trim().slice(0, 120);
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("password_confirm") ?? "");

  if (!fullName) return { error: "Ingresa tu nombre o el de tu empresa." };
  if (!EMAIL_RE.test(email)) return { error: "Ingresa un correo electrónico válido." };
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.` };
  }
  if (password !== confirm) return { error: "Las contraseñas no coinciden." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error?.status === 429) return { error: "Demasiados intentos. Espera unos minutos y vuelve a intentarlo." };
  if (error?.code === "user_already_exists" || error?.code === "email_exists") {
    return { error: "Ese correo ya tiene una cuenta. Inicia sesión." };
  }
  if (error?.code === "weak_password") return { error: "La contraseña es muy débil. Usa una más larga o variada." };
  if (error) return { error: "No se pudo crear la cuenta. Intenta de nuevo." };

  // Correo ya registrado: Supabase no da error (para no revelarlo) pero no crea sesión.
  if (!data.session) {
    return { error: "No se pudo crear la cuenta con ese correo. Si ya tienes una, inicia sesión." };
  }

  redirect("/portal/certificados");
}

// ---------- Clientes ----------

export async function resetClientPassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const clientId = String(formData.get("client_id") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!UUID_RE.test(clientId)) return { error: "Cliente inválido." };
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.` };
  }

  const { data: target } = await supabase.from("profiles").select("role").eq("id", clientId).single();
  if (target?.role !== "client") return { error: "Cliente inválido." }; // la del admin no se cambia desde aquí

  const { error } = await createAdminClient().auth.admin.updateUserById(clientId, { password });
  if (error) return { error: "No se pudo cambiar la contraseña. Intenta de nuevo." };

  return { success: "Contraseña actualizada. Compártela con el cliente." };
}

export async function deleteClientAccount(formData: FormData) {
  const { supabase } = await requireAdmin();
  const clientId = String(formData.get("client_id") ?? "");
  if (!UUID_RE.test(clientId)) return;

  const { data: target } = await supabase.from("profiles").select("role").eq("id", clientId).single();
  if (target?.role !== "client") return; // nunca eliminar un admin desde aquí

  // Borra el usuario de Auth (y su perfil en cascada). Los certificados son del inventario y se conservan.
  await createAdminClient().auth.admin.deleteUser(clientId);

  revalidatePath("/admin");
  redirect("/admin");
}

/** Aprueba o revoca el acceso de una cuenta al inventario de certificados. */
export async function setClientApproval(formData: FormData) {
  const { supabase } = await requireAdmin();
  const clientId = String(formData.get("client_id") ?? "");
  const approved = formData.get("approved") === "true";
  if (!UUID_RE.test(clientId)) return;

  await supabase.from("profiles").update({ approved }).eq("id", clientId).eq("role", "client");

  revalidatePath("/admin");
  revalidatePath(`/admin/clientes/${clientId}`);
}

// ---------- Certificados ----------

export type UploadedFile = { path: string; title: string; size: number };

/**
 * Registra en la base de datos PDFs que el navegador del admin ya subió a Storage
 * (subida directa para no pasar archivos grandes por la función serverless).
 */
export async function registerCertificates(files: UploadedFile[]): Promise<ActionState> {
  const { supabase } = await requireAdmin();
  const cleanup = () => supabase.storage.from(BUCKET).remove(files.map((f) => f.path).filter((p) => FILE_PATH_RE.test(p)));

  const valid =
    Array.isArray(files) &&
    files.length > 0 &&
    files.length <= 20 &&
    files.every(
      (f) =>
        FILE_PATH_RE.test(f.path) &&
        typeof f.title === "string" &&
        f.title.trim().length > 0 &&
        f.title.trim().length <= 200 &&
        Number.isInteger(f.size) &&
        f.size > 0 &&
        f.size <= MAX_FILE_SIZE,
    );
  if (!valid) {
    await cleanup();
    return { error: "Datos inválidos. Revisa los archivos e intenta de nuevo." };
  }

  const { error } = await supabase.from("certificates").insert(
    files.map((f) => ({ title: f.title.trim(), file_path: f.path, file_size: f.size })),
  );
  if (error) {
    await cleanup();
    return { error: "No se pudieron guardar los certificados. Intenta de nuevo." };
  }

  revalidatePath("/admin");
  revalidatePath("/portal/certificados");
  return {
    success: files.length === 1 ? "Certificado guardado." : `${files.length} certificados guardados.`,
  };
}

export async function deleteCertificate(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("certificate_id") ?? "");
  if (!UUID_RE.test(id)) return;

  const { data: certificate } = await supabase
    .from("certificates")
    .select("file_path")
    .eq("id", id)
    .single();
  if (!certificate) return;

  await supabase.storage.from(BUCKET).remove([certificate.file_path]);
  await supabase.from("certificates").delete().eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/portal/certificados");
}
