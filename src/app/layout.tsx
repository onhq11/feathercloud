import type { Metadata } from "next";
import "@/main.css";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "FeatherCloud",
  description: "Lightweight, fast, and secure cloud storage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
