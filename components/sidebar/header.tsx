import React from "react";
import Image from "next/image";
import { MessageSquareText, LogOut } from "lucide-react";
import { ArrowLeftFromLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import LogoUnesa from "@/assets/logo-unesa.svg";
import Link from "next/link";

function Header({ fnCloseSidebar }: { fnCloseSidebar: () => void }) {
  return (
    <>
      <Link href="/">
        <div className="flex items-center gap-3">
          <Image src={LogoUnesa} alt="Logo Unesa" width={40} />
          <h1 className="font-semibold text-lg">Helpdesk Unesa</h1>
        </div>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="translate-x-3"
        onClick={fnCloseSidebar}
      >
        <ArrowLeftFromLine className="w-4" strokeWidth={2.5} />
      </Button>
    </>
  );
}

export default Header;
