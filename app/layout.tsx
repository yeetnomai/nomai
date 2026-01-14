import type { Metadata } from "next";
import "./globals.css";
import BootstrapClient from "@/components/BootstrapClient";


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

        <main className="container py-4">
          {children}
        </main>
      </body>
    </html>
  );
}
