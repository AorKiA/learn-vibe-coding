import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, Trirong } from "next/font/google";
import "./globals.css";

/**
 * Both faces carry real Thai glyphs. A Latin-only display serif — Playfair,
 * Cormorant and the rest of the usual premium shortlist — would fall back
 * silently on every Thai heading, which is the whole interface.
 */
const trirong = Trirong({
  variable: "--font-trirong",
  weight: ["400", "500", "600"],
  subsets: ["latin", "thai"],
  display: "swap",
});

const plexThai = IBM_Plex_Sans_Thai({
  variable: "--font-plex-thai",
  weight: ["400", "500", "600"],
  subsets: ["latin", "thai"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ระบบจองห้องอ่านหนังสือ",
  description: "จองห้องอ่านหนังสือของมหาวิทยาลัย ดูช่วงเวลาว่าง และจัดการการจองของคุณ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${trirong.variable} ${plexThai.variable} h-full antialiased`}
    >
      <body className="text-ink min-h-full">{children}</body>
    </html>
  );
}
