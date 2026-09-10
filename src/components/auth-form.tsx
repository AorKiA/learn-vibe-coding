"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import {
  Button,
  Card,
  ErrorBanner,
  Field,
  Input,
  SuccessBanner,
} from "@/components/ui";
import { IDLE_STATE, type ActionState } from "@/lib/types";

function SubmitButton({ label }: { label: string }) {
  // Loading state (Requirement 9) comes from the form's own pending status.
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "กำลังดำเนินการ..." : label}
    </Button>
  );
}

export function AuthForm({
  mode,
  action,
  next,
  initialError,
}: {
  mode: "signin" | "signup";
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  next?: string;
  initialError?: string;
}) {
  const [state, formAction] = useActionState(action, IDLE_STATE);
  const isSignup = mode === "signup";

  return (
    <Card className="w-full max-w-sm">
      <h1 className="text-xl font-semibold">
        {isSignup ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
      </h1>
      <p className="text-ink-muted mt-1 text-sm">
        {isSignup
          ? "สร้างบัญชีเพื่อเริ่มจองห้องอ่านหนังสือ"
          : "เข้าสู่ระบบเพื่อจองห้องอ่านหนังสือ"}
      </p>

      <form action={formAction} className="mt-u2 space-y-u1" noValidate>
        {next && <input type="hidden" name="next" value={next} />}

        {initialError && !state.message && (
          <ErrorBanner>{initialError}</ErrorBanner>
        )}
        {state.message && !state.ok && <ErrorBanner>{state.message}</ErrorBanner>}
        {state.message && state.ok && (
          <SuccessBanner>{state.message}</SuccessBanner>
        )}

        <Field label="อีเมล" error={state.fieldErrors?.email}>
          <Input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@university.ac.th"
            invalid={Boolean(state.fieldErrors?.email)}
          />
        </Field>

        <Field
          label="รหัสผ่าน"
          error={state.fieldErrors?.password}
          hint={isSignup ? "อย่างน้อย 6 ตัวอักษร" : undefined}
        >
          <Input
            name="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            invalid={Boolean(state.fieldErrors?.password)}
          />
        </Field>

        <SubmitButton label={isSignup ? "สมัครสมาชิก" : "เข้าสู่ระบบ"} />
      </form>

      <p className="text-ink-muted mt-u2 text-center text-sm">
        {isSignup ? "มีบัญชีอยู่แล้ว? " : "ยังไม่มีบัญชี? "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="text-primary-dark font-medium hover:underline"
        >
          {isSignup ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
        </Link>
      </p>
    </Card>
  );
}
