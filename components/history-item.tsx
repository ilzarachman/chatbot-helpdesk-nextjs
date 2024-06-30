import React from "react";
import Link from "next/link";

export default function SidebarItem({ text }: { text: string }) {
    return (
        <Link href="#" className="block group relative grow text-sm whitespace-nowrap overflow-hidden p-2 pl-3 hover:bg-gray-900 rounded-sm text-gray-400">
            {text}
            <div className="absolute right-0 top-0 w-7 h-full bg-gradient-to-l from-40% from-gray-950 group-hover:from-gray-900"></div>
        </Link>
    )
}