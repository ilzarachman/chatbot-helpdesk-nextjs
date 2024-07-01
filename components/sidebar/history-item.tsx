import React from "react";
import Link from "next/link";

export default function SidebarItem({ text }: { text: string }) {
    return (
        <Link href="#" className="block group relative grow  whitespace-nowrap overflow-hidden p-2 pl-3 hover:bg-gray-900 rounded-sm text-accent-foreground">
            {text}
            <div className="absolute right-0 top-0 w-7 h-full bg-gradient-to-l from-40% from-gray-950 group-hover:from-gray-900 group-hover:w-14"></div>
        </Link>
    )
}