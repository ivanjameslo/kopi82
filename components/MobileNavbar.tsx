import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { NAVBAR_LINKS } from "@/lib/links";
import Link from "next/link";
const MobileNavbar = () => {
  const renderNavLinks = NAVBAR_LINKS.map((link) => (
    <Link href={link.href} key={link.label} className="hover:text-button">
      {link.label}
    </Link>
  ));

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-transparent md:hidden hover:bg-black">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="mb-3 uppercase font-bold">KOPI 82</SheetHeader>
        <div className="grid gap-4 py-4 font-medium text-xl ">
          {renderNavLinks}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavbar;