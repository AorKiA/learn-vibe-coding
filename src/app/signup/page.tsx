import { AuthForm } from "@/components/auth-form";
import { signUp } from "@/lib/actions/auth";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-u2">
      <AuthForm mode="signup" action={signUp} />
    </main>
  );
}
