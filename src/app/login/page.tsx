import { AuthForm } from "@/components/auth-form";
import { signIn } from "@/lib/actions/auth";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : undefined;
  const error = typeof params.error === "string" ? params.error : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center p-u2">
      <AuthForm mode="signin" action={signIn} next={next} initialError={error} />
    </main>
  );
}
