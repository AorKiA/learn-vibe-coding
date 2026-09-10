import type { ReactNode } from "react";

/**
 * The landing moment. A property site earns trust before it asks for anything,
 * so the sign-in form sits beside a statement of what the place is and what it
 * guarantees, rather than alone in the middle of an empty page.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-u6 px-u4 py-u6 lg:flex-row lg:items-center lg:gap-u6">
      <section className="settle max-w-md flex-1">
        <p className="text-brass-ink mb-u2 text-[11px] font-semibold tracking-[0.18em] uppercase">
          หอสมุดกลาง · มหาวิทยาลัย
        </p>
        <h1 className="text-display font-medium leading-tight text-balance">
          ห้องอ่านหนังสือที่จองไว้แล้ว เป็นของคุณ
        </h1>
        <p className="text-ink-muted mt-u3 max-w-sm">
          ดูรอบที่ว่างแบบเรียลไทม์ จองได้ในไม่กี่คลิก
          และจัดการรายการของคุณเองได้ตลอดเวลา
        </p>

        <ul className="mt-u5 grid gap-u3 sm:grid-cols-3">
          <Assurance title="หนึ่งรอบ หนึ่งการจอง">
            ฐานข้อมูลกันการจองซ้ำให้ ไม่มีทางชนกัน
          </Assurance>
          <Assurance title="ของคุณคือของคุณ">
            คนอื่นแก้หรือลบรายการของคุณไม่ได้
          </Assurance>
          <Assurance title="ยกเลิกได้เอง">
            คืนรอบให้คนอื่นจองต่อได้ทันที
          </Assurance>
        </ul>
      </section>

      <section className="settle flex w-full max-w-sm justify-center lg:flex-1">
        {children}
      </section>
    </main>
  );
}

function Assurance({ title, children }: { title: string; children: ReactNode }) {
  return (
    <li className="border-brass/40 border-t pt-u2">
      <p className="font-heading text-ink text-small font-medium">{title}</p>
      <p className="text-ink-subtle mt-1 text-xs leading-relaxed">{children}</p>
    </li>
  );
}
