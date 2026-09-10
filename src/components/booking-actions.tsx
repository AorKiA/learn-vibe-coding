"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { cancelBooking, deleteBooking } from "@/lib/actions/bookings";
import { Button, ErrorBanner } from "@/components/ui";
import { IDLE_STATE } from "@/lib/types";

function PendingButton({
  label,
  pendingLabel,
  variant,
  confirm,
}: {
  label: string;
  pendingLabel: string;
  variant: "danger" | "ghost";
  confirm: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant={variant}
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(confirm)) e.preventDefault();
      }}
    >
      {pending ? pendingLabel : label}
    </Button>
  );
}

export function BookingActions({
  id,
  status,
  canManage,
}: {
  id: string;
  status: string;
  canManage: boolean;
}) {
  const [cancelState, cancelAction] = useActionState(cancelBooking, IDLE_STATE);
  const [deleteState, deleteAction] = useActionState(deleteBooking, IDLE_STATE);

  // The buttons are hidden for other people's bookings purely for clarity.
  // The block that actually stops them lives in RLS and the Server Action.
  if (!canManage) {
    return <span className="text-ink-subtle text-xs">ของผู้ใช้อื่น</span>;
  }

  const error = cancelState.message && !cancelState.ok
    ? cancelState.message
    : deleteState.message && !deleteState.ok
      ? deleteState.message
      : null;

  return (
    <div className="space-y-1">
      {error && <ErrorBanner>{error}</ErrorBanner>}

      <div className="flex flex-wrap items-center gap-1">
        {status === "active" && (
          <>
            <Link
              href={`/bookings/${id}/edit`}
              className="rounded-subtle border border-border-strong px-u1 py-2 text-sm hover:bg-surface-muted"
            >
              แก้ไข
            </Link>
            <form action={cancelAction}>
              <input type="hidden" name="id" value={id} />
              <PendingButton
                label="ยกเลิก"
                pendingLabel="กำลังยกเลิก..."
                variant="danger"
                confirm="ยืนยันการยกเลิกการจองนี้?"
              />
            </form>
          </>
        )}

        {status === "cancelled" && (
          <form action={deleteAction}>
            <input type="hidden" name="id" value={id} />
            <PendingButton
              label="ลบถาวร"
              pendingLabel="กำลังลบ..."
              variant="ghost"
              confirm="ลบรายการนี้ถาวร? ไม่สามารถกู้คืนได้"
            />
          </form>
        )}
      </div>
    </div>
  );
}
