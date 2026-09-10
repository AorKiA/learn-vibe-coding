# สถานะงาน

แผนเต็ม: `C:\Users\User\.claude\plans\there-is-a-workshop-staged-quokka.md`

Supabase project: `xjyxrwqltursarujtlft` (ap-southeast-1, Postgres 17)

## เสร็จแล้ว

- [x] **0** `CLAUDE.md`
- [x] **1** scaffold Next.js 16.3.4 + TS + Tailwind v4 + App Router, `.env.example`,
      `.gitignore` (ยืนยันแล้วว่า `.env.local` ถูก ignore / `.env.example` ถูก track)
- [x] **2** SQL migrations `supabase/migrations/`
- [x] **3** Supabase clients, `proxy.ts`, login / signup / callback / signout
- [x] **A** รัน migration 0001-0004 บน Supabase แล้ว + `.env.local` ใส่ค่าแล้ว
      (ใช้ `sb_publishable_...` ไม่ใช่ legacy anon JWT)

ยืนยันแล้วจาก DB จริง: RLS เปิดครบ 4 ตาราง, 11 policies, `bookings_no_double_booking`
index มีอยู่, seed 5 rooms + 5 time_slots, role `anon` อ่านไม่เห็นอะไรเลย (0/0/0)

## ค้างอยู่

- [ ] **4** หน้า rooms + ตารางช่วงเวลาว่าง
- [ ] **5** booking create / edit / cancel (server actions)
- [ ] **6** `/admin/rooms` + role guard
- [ ] **7** polish loading / empty / error states
- [ ] **8** deploy Vercel
- [ ] **9** test harness + `npm run verify`

## เรื่องที่ต่างจากแผนเดิม (ต้องรู้)

- **Next.js 16 เปลี่ยน `middleware.ts` → `proxy.ts`** และ export ชื่อ `proxy`
  ไฟล์อยู่ที่ `src/proxy.ts` — คู่มือ Supabase ส่วนใหญ่ยังเขียนว่า `middleware.ts`
- Next 16 มี generated route types (`PageProps<"/login">`) ต้องรัน `npm run typegen`
  หลังเพิ่มหน้าใหม่ ไม่งั้น `tsc` จะ error ว่า route ไม่มีอยู่จริง
- `cookies()` เป็น async ต้อง `await`
- Tailwind v4 ใช้ `@theme` ใน `globals.css` ไม่มี `tailwind.config.ts`
- **restore Supabase project แล้วต้องรอ status `ACTIVE_HEALTHY` ก่อนรัน migration**
  ครั้งแรกรันตอน `COMING_UP` แล้ว schema หายหมดตอน restore เสร็จ ต้องรันซ้ำ
- ไม่มี `python` บนเครื่องนี้ ใช้ `node -e` แทน

## ยังต้องคลิกเองใน dashboard (MCP ทำให้ไม่ได้)

1. Supabase → Authentication → Providers → Email: **ปิด "Confirm email"**
2. Supabase → Authentication → URL Configuration: Site URL + Redirect URLs
   (`http://localhost:3000/auth/callback` และ `https://<app>.vercel.app/auth/callback`)
3. Vercel → ยังไม่มี team ในบัญชี (`list_teams` คืนค่าว่าง) ต้องสร้าง team
   หรือ deploy เองก่อนถึงขั้นที่ 8
4. เลื่อน admin ทำผ่าน MCP `execute_sql` ได้เลย:
   `update profiles set role='admin' where email='...'`
   (auth.uid() เป็น null จึงผ่าน trigger prevent_role_escalation)
