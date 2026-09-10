import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
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
      className={`${inter.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="bg-bg text-ink min-h-full">{children}</body>
    </html>
  );
}
