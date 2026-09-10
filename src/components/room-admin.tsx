"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  Button,
  Card,
  ErrorBanner,
  Field,
  Input,
  SuccessBanner,
} from "@/components/ui";
import { createRoom, toggleRoomActive } from "@/lib/actions/rooms";
import { IDLE_STATE, type Room } from "@/lib/types";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "กำลังบันทึก..." : label}
    </Button>
  );
}

export function NewRoomForm() {
  const [state, formAction] = useActionState(createRoom, IDLE_STATE);

  return (
    <Card className="max-w-xl">
      <h2 className="font-medium">เพิ่มห้องใหม่</h2>
      <form action={formAction} className="mt-u1 space-y-u1" noValidate>
        {state.message && !state.ok && <ErrorBanner>{state.message}</ErrorBanner>}
        {state.message && state.ok && <SuccessBanner>{state.message}</SuccessBanner>}

        <Field label="ชื่อห้อง" error={state.fieldErrors?.name}>
          <Input name="name" invalid={Boolean(state.fieldErrors?.name)} />
        </Field>

        <Field label="ความจุ (ที่นั่ง)" error={state.fieldErrors?.capacity}>
          <Input
            name="capacity"
            type="number"
            min={1}
            max={500}
            defaultValue={4}
            invalid={Boolean(state.fieldErrors?.capacity)}
          />
        </Field>

        <Field label="สถานที่" error={state.fieldErrors?.location}>
          <Input name="location" placeholder="อาคาร ... ชั้น ..." />
        </Field>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_active" defaultChecked />
          เปิดให้จองทันที
        </label>

        <SubmitButton label="เพิ่มห้อง" />
      </form>
    </Card>
  );
}

export function RoomToggle({ room }: { room: Room }) {
  const [state, formAction] = useActionState(toggleRoomActive, IDLE_STATE);
  const { is_active } = room;

  return (
    <div className="space-y-1">
      {state.message && !state.ok && <ErrorBanner>{state.message}</ErrorBanner>}
      <form action={formAction}>
        <input type="hidden" name="id" value={room.id} />
        <input type="hidden" name="next_active" value={String(!is_active)} />
        <Button type="submit" variant={is_active ? "danger" : "outline"}>
          {is_active ? "ปิดใช้งาน" : "เปิดใช้งาน"}
        </Button>
      </form>
    </div>
  );
}
