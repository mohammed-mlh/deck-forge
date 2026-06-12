import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your DeckForge account.",
};

export default function RegisterPage() {
  return (
    <AuthPageShell
      title="Create your account"
      description="Start building and saving decks for free."
    >
      <RegisterForm />
    </AuthPageShell>
  );
}
