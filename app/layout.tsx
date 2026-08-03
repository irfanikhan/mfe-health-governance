import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pulseboard · MFE Health Governance",
  description:
    "A governance control plane for micro frontend performance, dependencies, pull requests, and release health.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
