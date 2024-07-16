import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { splitStringIntoChars } from "@/lib/utils";
import { useContext } from "react";
import { ChatContext } from "@/lib/context-provider";

export default function SidebarItem({ text, uuid }: { text: string; uuid: string }) {
    return (
        <Link
            href={`/${uuid}`}
            className="block group relative grow  whitespace-nowrap overflow-hidden p-2 pl-3 hover:bg-gray-900 rounded-sm text-accent-foreground"
        >
            {text}
            <div className="absolute right-0 top-0 w-7 h-full bg-gradient-to-l from-40% from-gray-950 group-hover:from-gray-900 group-hover:w-14"></div>
        </Link>
    );
}

const headerAppearVariants: Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
    },
};

export function HistoryItemAnimated({ text, uuid, updateHistory }: { text: string; uuid: string; updateHistory: () => Promise<void> }) {
    const { newConvHistory } = useContext(ChatContext);

    const chars = splitStringIntoChars(text);

    return (
        <Link
            href={`/${uuid}`}
            className="block group relative grow  whitespace-nowrap overflow-hidden p-2 pl-3 hover:bg-gray-900 rounded-sm text-accent-foreground"
        >
            <motion.p initial="hidden" whileInView="visible" transition={{ staggerChildren: 0.015 }} onAnimationComplete={async () => {
                await updateHistory();
                newConvHistory.fn({title: "", uuid: ""});
            }}>
                {chars.map((char, index) => (
                    <motion.span key={index} transition={{ duration: 0.001, ease: "easeIn" }} variants={headerAppearVariants}>{char}</motion.span>
                ))}
            </motion.p>
            <div className="absolute right-0 top-0 w-7 h-full bg-gradient-to-l from-40% from-gray-950 group-hover:from-gray-900 group-hover:w-14"></div>
        </Link>
    );
}
