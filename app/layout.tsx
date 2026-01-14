import type { Metadata } from "next";
import "./globals.css";
import BootstrapClient from "@/components/BootstrapClient";
import BackgroundMusic from "@/components/BackgroundMusic";

export const metadata: Metadata = {
  title: "Student Management System",
  description: "Nomai Student Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>
        <BootstrapClient />
        <BackgroundMusic />
        <main className="container py-4">
          {children}
        </main>
      </body>
    </html>
  );
}
