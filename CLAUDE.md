# Study Room Booking

ระบบจองห้องอ่านหนังสือของมหาวิทยาลัย

## Language

- ตอบผู้ใช้เป็น **ภาษาไทย** เสมอ
- Internal progress — thinking, plan files, commit messages, code comments, variable
  names, TODO lists, and tool-call narration — stay in **English**
- ศัพท์เทคนิค (Server Action, RLS, constraint, migration, policy) เขียนทับด้วยภาษาอังกฤษได้ ไม่ต้องแปล

## Stack

Next.js App Router + TypeScript + Tailwind CSS + Supabase (PostgreSQL, Auth, RLS) → Vercel

## Rules

- สิทธิ์ต้องบังคับที่ Supabase RLS — การซ่อนปุ่มใน UI ไม่นับเป็นการป้องกันข้อมูล
- `user_id` มาจาก `supabase.auth.getUser()` ในฝั่ง server เท่านั้น ห้ามรับจาก form แล้วเชื่อ
- อ่านข้อมูล = Server Component / เปลี่ยนข้อมูล = Server Action
- RLS ปฏิเสธ update/delete โดย**ไม่ error** แต่คืน 0 rows — ทุก mutation ต้อง `.select()`
  แล้วเช็ก `data.length === 0` เป็น permission error
- ห้ามมี `service_role` key หรือ secret ใด ๆ ใน repo หรือ frontend
- Style ตาม `design2.md` (Genesis / PrimeNG — monochrome slate)
  `design.md` เป็นของเดิม (PrimeReact Ultima) ไม่ใช้แล้ว

## Commands

```
npm run dev
npm run build
npx tsc --noEmit
PROD_URL=<vercel-url> npm run verify   # 12 acceptance tests
```
