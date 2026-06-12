import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to DeckForge.",
};

export default function LoginPage() {
  return (
    <AuthPageShell title="Welcome back" description="Sign in to access your saved decks.">
      <LoginForm />
    </AuthPageShell>
  );
}
