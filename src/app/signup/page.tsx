import { AuthForm } from "@/components/auth-form";
import { AuthShell } from "@/components/auth-shell";
import { signUp } from "@/lib/actions/auth";

export default function SignupPage() {
  return (
    <AuthShell>
      <AuthForm mode="signup" action={signUp} />
    </AuthShell>
  );
}
