import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import MobileNavbar from "@/components/MobileNavbar";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kopi 82 Admin App",
  description: " ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <NavBar />
        <MobileNavbar /> */}
        <div className="flex flex-row">

          <Sidebar />
          <div className="flex flex-col w-full max-h-screen overflow-y-auto">

            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
