"use client";

import React, { useContext, useEffect } from "react";
import { ChatContext, sidebarTransition } from "@/lib/context-provider";
import { Button } from "@/components/ui/button";
import { ArrowRightFromLine, CornerDownLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { convertRemToPixels } from "@/lib/utils";

export default function Chat() {
    const { sidebarOpen, sidebarTransition: sidebarTransitionContext } = useContext(ChatContext);

    function openSidebar() {
        sidebarOpen.fn(true);
        sidebarTransition(sidebarTransitionContext);
    }

    useEffect(() => {
        const promptArea: HTMLTextAreaElement = document.getElementById("_prompt_area") as HTMLTextAreaElement;

        promptArea.style.height = "auto";
        promptArea.style.height = promptArea.scrollHeight + "px";
        promptArea.style.overflowY = "hidden";

        const _75rem = convertRemToPixels(0.75);

        function handleInputPrompt(e: Event) {
            const target = e.target as HTMLTextAreaElement;
            if (target.scrollHeight >= 200 - _75rem) {
                target.style.overflowY = "auto";
                return;
            }

            target.style.height = "auto";
            target.style.height = target.scrollHeight + "px";
        }

        function handleKeyDownPrompt(e: KeyboardEvent) {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
            }
        }

        promptArea.addEventListener("input", handleInputPrompt, false);
        promptArea.addEventListener("keydown", handleKeyDownPrompt, false);

        return () => {
            promptArea.removeEventListener("input", handleInputPrompt);
            promptArea.removeEventListener("keydown", handleKeyDownPrompt);
        };
    }, []);

    return (
        <section className="w-full p-4 h-svh bg-gray-950 z-10 pb-1">
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between h-[40px] sticky">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={openSidebar} style={{ display: sidebarOpen.value ? "none" : "inline-flex" }}>
                            <ArrowRightFromLine className="w-4" />
                        </Button>
                        <h1>Title of this chat</h1>
                    </div>
                    <div></div>
                </div>
                <div role="_chat_box" className="max-w-[830px] mx-auto w-[830px] h-full flex flex-col justify-between">
                    <div className="">Chat</div>
                    <div role="_chat_input" className="flex flex-col items-center gap-2">
                        <div className="w-full min-h-[56px] max-h-[200px] bg-gray-900 rounded-3xl flex items-center">
                            <div className="px-4 w-full py-4">
                                <Textarea
                                    id="_prompt_area"
                                    rows={1}
                                    className="w-full min-h-[20px] max-h-[200px] bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none items-center py-0"
                                    placeholder="Write a message..."
                                />
                            </div>
                            <div className="flex h-full mr-3 items-end justify-center py-2">
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <CornerDownLeft className="w-4" />
                                </Button>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs">Please be aware that this feature is currently experimental.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
