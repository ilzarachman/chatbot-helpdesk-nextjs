import React, { useContext } from "react";
import { ChatContext, sidebarTransition } from "@/lib/context-provider";
import { Button } from "@/components/ui/button";
import { ArrowRightFromLine } from "lucide-react";

export default function Chat() {
    const { sidebarOpen, sidebarTransition: sidebarTransitionContext } = useContext(ChatContext);

    function openSidebar() {
        sidebarOpen.fn(true);
        sidebarTransition(sidebarTransitionContext);
    }

    return (
        <section className="w-full p-4 h-svh bg-gray-950 z-10">
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between h-[40px]">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={openSidebar} style={{display: sidebarOpen.value ? 'none' : 'inline-flex'}}>
                            <ArrowRightFromLine className="w-4" />
                        </Button>
                        <h1>Title of this chat</h1>
                    </div>
                </div>
                <div role="_chat_box" className="max-w-[830px] mx-auto w-[830px]">
                    <div className="p-3">Chat</div>
                </div>
            </div>
        </section>
    );
}
