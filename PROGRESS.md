# สถานะงาน

แผนเต็ม: `C:\Users\User\.claude\plans\there-is-a-workshop-staged-quokka.md`

## เสร็จแล้ว

- [x] **0** `CLAUDE.md`
- [x] **1** scaffold Next.js 16.3.4 + TS + Tailwind v4 + App Router, `.env.example`,
      `.gitignore` (ยืนยันแล้วว่า `.env.local` ถูก ignore / `.env.example` ถูก track)
- [x] **2** SQL migrations — `supabase/migrations/000{1,2,3}_*.sql` (**ยังไม่ได้รันบน Supabase**)
- [x] **3** Supabase clients, `proxy.ts`, login / signup / callback / signout

## ค้างอยู่

- [ ] **A** รัน migration 3 ไฟล์บน Supabase + ใส่ค่าใน `.env.local`
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
- Supabase MCP extension เพิ่มไว้แล้วแต่ยังไม่ active ต้อง restart session

## ยังต้องคลิกเองใน dashboard (MCP ทำให้ไม่ได้)

1. Supabase → Authentication → Providers → Email: **ปิด "Confirm email"**
2. Supabase → Authentication → URL Configuration: Site URL + Redirect URLs
   (`http://localhost:3000/auth/callback` และ `https://<app>.vercel.app/auth/callback`)
3. Vercel → Environment Variables
4. เลื่อน admin: `update profiles set role='admin' where email='...'`
