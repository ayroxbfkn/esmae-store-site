import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Esmae Studio",
  description: "Premium Multilingual Printing Studio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
