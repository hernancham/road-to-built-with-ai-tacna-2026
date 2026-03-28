"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getURL } from "@/lib/utils";
import { routes } from "@/lib/routes";

export type AuthState = {
  error?: string;
  success?: string;
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export async function signIn(formData: {
  email: string;
  password: string;
}): Promise<AuthState> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect(routes.redirects.afterSignIn);
}

// ─── REGISTER ─────────────────────────────────────────────────────────────────
export async function signUp(formData: {
  email: string;
  password: string;
  full_name: string;
  dni: string;
  phone: string;
}): Promise<AuthState> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.full_name,
        dni: formData.dni,
        phone: formData.phone,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success:
      "Cuenta creada exitosamente. Revisa tu correo para confirmar tu cuenta.",
  };
}

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(routes.redirects.afterSignOut);
}

// ─── FORGOT PASSWORD ─────────────────────────────────────────────────────────
export async function forgotPassword(formData: {
  email: string;
}): Promise<AuthState> {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
    redirectTo: `${getURL()}${routes.auth.updatePassword.slice(1)}`,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: "Te enviamos un correo con el enlace para restablecer tu contraseña.",
  };
}

// ─── UPDATE PASSWORD ─────────────────────────────────────────────────────────
export async function updatePassword(formData: {
  password: string;
}): Promise<AuthState> {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: formData.password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect(routes.redirects.afterSignIn);
}
