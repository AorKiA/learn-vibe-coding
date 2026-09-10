"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@/components/ui";

/** Changing the date is a navigation, so the grid re-renders on the server. */
export function DatePicker({ value, min }: { value: string; min: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  return (
    <label className="flex items-center gap-u2">
      <span className="text-small font-medium whitespace-nowrap">วันที่</span>
      <Input
        type="date"
        name="date"
        value={value}
        min={min}
        disabled={pending}
        aria-busy={pending}
        className="max-w-44"
        onChange={(e) => {
          const params = new URLSearchParams(searchParams);
          params.set("date", e.target.value);
          startTransition(() => router.push(`${pathname}?${params}`));
        }}
      />
      {pending && <span className="text-ink-muted text-xs">กำลังโหลด...</span>}
    </label>
  );
}
