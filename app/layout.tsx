"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/app/kopi82-app/context/cartContext";
import ConditionalSidebar from "@/components/ConditionalSidebar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <div className="flex flex-row">
            <ConditionalSidebar />
            <div className="flex flex-col w-full max-h-screen overflow-y-auto">
              {children}
            </div>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
