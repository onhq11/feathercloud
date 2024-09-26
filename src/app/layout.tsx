import type { Metadata } from "next";
import "@/main.css";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "FeatherCloud",
  description: "Lightweight, fast, and secure cloud storage.",
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
      sizes: "any",
    },
    {
      rel: "apple-touch-icon",
      url: "/apple-touch-icon.png",
      sizes: "180x180",
    },
    {
      rel: "icon",
      url: "/favicon-32x32.png",
      sizes: "32x32",
    },
    {
      rel: "icon",
      url: "/favicon-16x16.png",
      sizes: "16x16",
    },
    {
      rel: "manifest",
      url: "/site.webmanifest",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
