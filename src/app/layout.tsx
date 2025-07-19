import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "پنل مدیریت",
  description: "تولید شده توسط نکست",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa">
      <body >
        <Toaster position="top-center" reverseOrder={false} />

        {children}
      </body>
    </html>
  );
}
