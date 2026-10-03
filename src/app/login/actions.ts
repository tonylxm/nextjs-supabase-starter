"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { LOGIN_PATH, SIGNED_IN_PATH } from "@/lib/supabase/routes";

const MIN_PASSWORD_LENGTH = 8;

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(MIN_PASSWORD_LENGTH),
  intent: z.enum(["sign-in", "sign-up"]),
});

export interface AuthFormState {
  error?: string;
  message?: string;
  // React resets the form after each action, so the typed email comes back to refill the field.
  email?: string;
}

export async function authenticate(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = credentialsSchema.safeParse(Object.fromEntries(formData));
  const typedEmail = String(formData.get("email") ?? "");
  if (!parsed.success) {
    return {
      error: `Enter a valid email and a password of at least ${MIN_PASSWORD_LENGTH} characters.`,
      email: typedEmail,
    };
  }

  const { email, password, intent } = parsed.data;
  const supabase = await createClient();

  if (intent === "sign-in") {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return { error: error.message, email };
    }
    redirect(SIGNED_IN_PATH);
  }

  const origin = (await headers()).get("origin") ?? "";
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) {
    return { error: error.message, email };
  }
  if (!data.session) {
    return {
      message: "Check your email for a link to confirm your account.",
      email,
    };
  }
  redirect(SIGNED_IN_PATH);
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(LOGIN_PATH);
}
