"use client";

import React, { useContext, useEffect, useState, ChangeEvent, useRef } from "react";
import { ChatContext, sidebarTransition } from "@/lib/context-provider";
import { Button } from "@/components/ui/button";
import { ArrowRightFromLine, CornerDownLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { convertRemToPixels } from "@/lib/utils";
import { UserChat, BotChat } from "@/components/chat/chat-item";
import { getChatbotResponse } from "@/lib/utils";

export default function Chat() {
    const { sidebarOpen, sidebarTransition: sidebarTransitionContext } = useContext(ChatContext);
    const [history, updateHistory] = useState<Array<Array<string>>>([]);

    const [isUpdatingResponse, setIsUpdatingResponse] = useState(false);
    const [streamResponse, updateStreamResponse] = useState<string>("");
    const streamResponseRef = useRef(streamResponse);
    const [prompt, updatePrompt] = useState<string>("");
    const promptRef = useRef(prompt);

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
                const _prompt = promptRef.current;

                setIsUpdatingResponse(true);
                getChatbotResponse(_prompt, handleStreamedResponse, (response: string) => {
                    updateHistory((prev) => [...prev, [_prompt, response]]);
                    updatePrompt("");
                    updateStreamResponse("");
                    setIsUpdatingResponse(false);
                });
                return;
            }
        }

        promptArea.addEventListener("input", handleInputPrompt, false);
        promptArea.addEventListener("keydown", handleKeyDownPrompt, false);

        return () => {
            promptArea.removeEventListener("input", handleInputPrompt);
            promptArea.removeEventListener("keydown", handleKeyDownPrompt);
        };
    }, []);

    function handleChangePrompt(e: ChangeEvent<HTMLTextAreaElement>) {
        const target = e.target as HTMLTextAreaElement;

        updatePrompt(target.value);
    }

    function handleStreamedResponse(chunk: string) {
        updateStreamResponse((prev) => {
            const updatedResponse = prev + chunk;
            streamResponseRef.current = updatedResponse;
            return updatedResponse;
        });
    }

    useEffect(() => {
        promptRef.current = prompt;
    }, [prompt]);

    useEffect(() => {
        streamResponseRef.current = streamResponse;
    }, [streamResponse]);

    return (
        <section className="w-full h-svh bg-gray-950 z-10 pb-1 flex flex-col">
            <div className="flex items-center justify-center p-4 py-6 relative">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={openSidebar}
                        className="absolute left-4"
                        style={{ display: sidebarOpen.value ? "none" : "inline-flex" }}
                    >
                        <ArrowRightFromLine className="w-4" />
                    </Button>
                    <h1 className="font-bold">Title of this chat</h1>
                </div>
            </div>
            <div role="_chat_box" className="h-full overflow-y-auto relative">
                <div className="max-h-full">
                    <div className="mx-auto max-w-[830px] w-[830px] flex flex-col">
                        {history.map((item, index) => (
                            <div key={index} data-generation={false}>
                                <UserChat text={item[0]} />
                                <BotChat text={item[1]} />
                            </div>
                        ))}

                        {isUpdatingResponse ? (
                            <div data-generation>
                                <UserChat text={prompt} />
                                <BotChat text={streamResponse} />
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </div>
            <div role="_chat_input" className="flex flex-col items-center gap-2 max-w-[830px] mx-auto w-[830px] relative">
                <div className="w-[calc(100%+100px)] h-8 bg-gradient-to-t from-gray-950 absolute -translate-y-full"></div>
                <div className="w-full min-h-[56px] max-h-[200px] bg-gray-900 rounded-3xl flex items-center">
                    <div className="px-4 w-full py-4">
                        <Textarea
                            id="_prompt_area"
                            rows={1}
                            className="w-full min-h-[20px] max-h-[200px] bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none items-center py-0"
                            placeholder="Write a message..."
                            onChange={handleChangePrompt}
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
        </section>
    );
}
