import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brukflix",
  description: "The best movie and series streaming platform with no ads😎",
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
