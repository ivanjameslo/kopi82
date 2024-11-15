"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function ConditionalSidebar() {
  const pathname = usePathname();
  const isPageNoSidebar =
    pathname === "/Login" ||
    pathname.startsWith("/appMenu") ||
    pathname.startsWith("/kopi82-app");

  if (isPageNoSidebar) return null;
  return <Sidebar />;
}
