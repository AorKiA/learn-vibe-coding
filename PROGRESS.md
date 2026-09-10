# สถานะงาน

แผนเต็ม: `C:\Users\User\.claude\plans\there-is-a-workshop-staged-quokka.md`

- Supabase project: `xjyxrwqltursarujtlft` (ap-southeast-1, Postgres 17)
- GitHub: https://github.com/AorKiA/learn-vibe-coding (branch `main`)

## เสร็จแล้ว

- [x] **0** `CLAUDE.md`
- [x] **1** scaffold Next.js 16.3.4 + TS + Tailwind v4 + App Router
- [x] **2** SQL migrations `supabase/migrations/0001`–`0004`
- [x] **3** Supabase clients, `proxy.ts`, login / signup / callback / signout
- [x] **A** รัน migration บน Supabase + `.env.local` (ใช้ `sb_publishable_...`)
- [x] **4** หน้า rooms + ตารางช่วงเวลาว่าง
- [x] **5** booking create / edit / cancel (Server Actions)
- [x] **6** `/admin/rooms` + role guard
- [x] **7** loading / empty / error states
- [x] **9** test harness — `npm run verify` (secrets + RLS + Playwright)
- [x] **GitHub** push แล้ว

## ค้างอยู่

- [ ] **8** Deploy Vercel — ติดที่ **Vercel MCP ใช้ไม่ได้**: `list_teams` คืนค่าว่าง
      และทุก tool บังคับ `teamId`; ลองใช้ slug `AorKiA` แล้วได้ 403 Not authorized
      → ต้อง import repo ผ่าน Vercel dashboard เอง (ดูขั้นตอนด้านล่าง)
- [ ] รัน `PROD_URL=<vercel-url> npm run verify` เพื่อปิด AT#11

## ผลการทดสอบล่าสุด (รันกับ localhost)

```
Secret scan ....................... 6/6 PASS
RLS + constraints ................. 9/9 PASS
Playwright e2e ................... 12/12 PASS
```

หลักฐานฝั่ง DB (ไม่ใช้ service_role key เลย — login เป็นผู้ใช้จริง 2 คน):
B แก้ booking ของ A → 0 rows / B ลบ → 0 rows / B ปลอม user_id → 403 (42501) /
จองซ้ำพร้อมกัน → 201 + 409 code 23505 / ยกเลิกแล้วจองใหม่ได้ → 201 /
ผู้ใช้เลื่อนตัวเองเป็น admin → 403

## ขั้นตอน deploy ที่ต้องทำเอง

1. vercel.com → Add New → Project → Import `AorKiA/learn-vibe-coding`
2. Environment Variables ใส่ 2 ตัว (ค่าเดียวกับใน `.env.local`) ทั้ง Production/Preview/Development
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy แล้วคัดลอก URL
4. Supabase → Authentication → URL Configuration
   - Site URL = `https://<app>.vercel.app`
   - Redirect URLs เพิ่ม `https://<app>.vercel.app/auth/callback`
     (**ถ้าลืมข้อนี้ AT#12 จะไม่ผ่านบน production**)
5. `PROD_URL=https://<app>.vercel.app npm run verify`

## เรื่องที่ต่างจากแผนเดิม (ต้องรู้)

- **Next.js 16 เปลี่ยน `middleware.ts` → `proxy.ts`** และ export ชื่อ `proxy`
  (`src/proxy.ts`) — คู่มือ Supabase ส่วนใหญ่ยังเขียนว่า `middleware.ts`
- Next 16 มี generated route types ต้อง `npm run typegen` หลังเพิ่มหน้าใหม่
- `cookies()` เป็น async / Tailwind v4 ใช้ `@theme` ไม่มี `tailwind.config.ts`
- **restore Supabase project แล้วต้องรอ `ACTIVE_HEALTHY` ก่อนรัน migration**
  ครั้งแรกรันตอน `COMING_UP` แล้ว schema หายหมด ต้องรันซ้ำ
- **Browser pane ไม่ resolve suspense จาก streamed response** — หน้า dynamic
  จะค้างที่ skeleton ทั้งที่แอปปกติ ยืนยันแล้วว่าใน Chromium จริงผ่านหมด 12/12
  ถ้าจะดูหน้าเว็บระหว่างพัฒนา ใช้ Playwright หรือเบราว์เซอร์จริง
- ไม่มี `python`, `gh` CLI บนเครื่องนี้ ใช้ `node -e` แทน
- git config ของ repo นี้ตั้ง user เป็น `AorKiA` + GitHub noreply email
  เฉพาะ local (global เป็นของบริษัท ไม่ถูกแตะ) — commit ใหม่จะใช้ค่านี้อัตโนมัติ
