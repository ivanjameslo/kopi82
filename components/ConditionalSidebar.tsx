// app/components/ConditionalSidebar.tsx
"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function ConditionalSidebar() {
  const pathname = usePathname();
  const isLoginPage = pathname === "/Login";

  if (isLoginPage) return null;
  return <Sidebar />;
}
