import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BotMessageSquare } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp } from "lucide-react";

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

export function BotChat({ text, generation }: { text: string; generation: boolean }) {
    return (
        <>
            <div className="p-4 my-4 mt-2 max-w-3xl flex gap-5 w-full min-w-full">
                <Avatar>
                    <AvatarFallback className="bg-transparent">
                        <BotMessageSquare className="w-6 h-6" />
                    </AvatarFallback>
                </Avatar>

                {text != "" ? (
                    <div className="flex flex-col gap-2">
                        <div className="pt-2 g-markdown-container" data-generation={generation}>
                            <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
                        </div>
                        {!generation ? <ThumbsUp className="w-6 h-6" /> : ""}
                    </div>
                ) : (
                    <div className="flex flex-col w-full ">
                        <div className="animate-pulse bg-muted h-3 w-full rounded-full mt-1"></div>
                        <div className="animate-pulse bg-muted h-3 w-[80%] rounded-full mt-2"></div>
                    </div>
                )}
            </div>
        </>
    );
}
