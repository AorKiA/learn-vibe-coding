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
  Select,
  Textarea,
} from "@/components/ui";
import { IDLE_STATE, type ActionState, type Room, type TimeSlot } from "@/lib/types";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "กำลังบันทึก..." : label}
    </Button>
  );
}

export function BookingForm({
  action,
  rooms,
  slots,
  today,
  defaults,
  submitLabel,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  rooms: Room[];
  slots: TimeSlot[];
  today: string;
  defaults: {
    id?: string;
    room_id?: string;
    slot_id?: string;
    booking_date?: string;
    purpose?: string;
  };
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, IDLE_STATE);

  return (
    <Card className="max-w-xl">
      {/* noValidate hands validation to the server schema, so the tests exercise
          the real rules rather than the browser's built-in messages. */}
      <form action={formAction} className="space-y-u2" noValidate>
        {defaults.id && <input type="hidden" name="id" value={defaults.id} />}

        {state.message && !state.ok && <ErrorBanner>{state.message}</ErrorBanner>}

        <Field label="ห้อง" error={state.fieldErrors?.room_id}>
          <Select
            name="room_id"
            defaultValue={defaults.room_id ?? ""}
            invalid={Boolean(state.fieldErrors?.room_id)}
          >
            <option value="">— เลือกห้อง —</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} ({room.capacity} ที่นั่ง)
              </option>
            ))}
          </Select>
        </Field>

        <Field label="วันที่" error={state.fieldErrors?.booking_date}>
          <Input
            type="date"
            name="booking_date"
            min={today}
            defaultValue={defaults.booking_date ?? today}
            invalid={Boolean(state.fieldErrors?.booking_date)}
          />
        </Field>

        <Field label="รอบเวลา" error={state.fieldErrors?.slot_id}>
          <Select
            name="slot_id"
            defaultValue={defaults.slot_id ?? ""}
            invalid={Boolean(state.fieldErrors?.slot_id)}
          >
            <option value="">— เลือกรอบเวลา —</option>
            {slots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="วัตถุประสงค์การใช้งาน"
          error={state.fieldErrors?.purpose}
          hint="เช่น อ่านหนังสือสอบ, ประชุมกลุ่มวิชา..."
        >
          <Textarea
            name="purpose"
            rows={3}
            defaultValue={defaults.purpose ?? ""}
            invalid={Boolean(state.fieldErrors?.purpose)}
          />
        </Field>

        <div className="flex items-center gap-u2 pt-1">
          <SubmitButton label={submitLabel} />
          <Link
            href="/bookings"
            className="text-ink-muted hover:text-ink text-small"
          >
            ยกเลิก
          </Link>
        </div>
      </form>
    </Card>
  );
}
