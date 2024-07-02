import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BotMessageSquare } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Separator } from "@/components/ui/separator";

export function UserChat({ text }: { text: string }) {
    return (
        <>
            <div className="p-7 max-w-3xl flex gap-5 w-full min-w-full bg-muted rounded-3xl pr-14 ">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className="text-foreground pt-2 w-full">{text}</p>
            </div>
        </>
    );
}

export function BotChat({ text }: { text: string }) {
    return (
        <>
            <div className="p-4 max-w-3xl flex gap-5 w-full min-w-full">
                <Avatar>
                    <AvatarFallback className="bg-transparent">
                        <BotMessageSquare className="w-6 h-6" />
                    </AvatarFallback>
                </Avatar>
                <div className="pt-2 g-markdown-container">
                    <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
                </div>
            </div>
        </>
    );
}
