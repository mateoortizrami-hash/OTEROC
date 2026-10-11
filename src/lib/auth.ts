import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "client";
  approved: boolean;
};

/** Usuario verificado (JWT validado) + su perfil, o null. */
export async function getCurrentProfile() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return { supabase, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, approved")
    .eq("id", userId)
    .single<Profile>();

  return { supabase, profile };
}

export async function requireAdmin() {
  const { supabase, profile } = await getCurrentProfile();
  if (!profile) redirect("/portal");
  if (profile.role !== "admin") redirect("/portal/certificados");
  return { supabase, profile };
}

export async function requireClient() {
  const { supabase, profile } = await getCurrentProfile();
  if (!profile) redirect("/portal");
  return { supabase, profile };
}
