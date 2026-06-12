import { SignIn } from "@clerk/nextjs";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function SignInPage() {
  return (
    <AuthPageShell
      title="Welcome back"
      description="Sign in to build, save, and manage your Yu-Gi-Oh decks."
    >
      <SignIn appearance={clerkAppearance} />
    </AuthPageShell>
  );
}
