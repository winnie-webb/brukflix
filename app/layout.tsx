import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/Footer";
export const metadata: Metadata = {
  title: "Brukflix",
  description: "The best movie and series streaming platform with no ads😎",
};
import NavBar from "./components/NavBar";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar></NavBar>

        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
