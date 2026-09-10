"use client";

import { Button, Card, ErrorBanner } from "@/components/ui";

/** Error state (Requirement 9) — the last net under any unmapped failure. */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Card>
      <h1 className="text-lg font-semibold">เกิดข้อผิดพลาด</h1>
      <div className="mt-u1">
        <ErrorBanner>
          ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง
          {error.digest && (
            <span className="text-ink-muted mt-1 block text-xs">
              รหัสอ้างอิง: {error.digest}
            </span>
          )}
        </ErrorBanner>
      </div>
      <div className="mt-u2">
        <Button onClick={reset}>ลองใหม่</Button>
      </div>
    </Card>
  );
}
