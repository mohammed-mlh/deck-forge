import { SignUp } from "@clerk/nextjs";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function SignUpPage() {
  return (
    <AuthPageShell
      title="Create your account"
      description="Join DeckForge to save decks and use the full deck builder."
    >
      <SignUp appearance={clerkAppearance} />
    </AuthPageShell>
  );
}
