"use client";

import React, { useState } from "react";
import { ChatContext } from "@/lib/context-provider";
import { Separator } from "@/components/ui/separator";
import Sidebar from "@/components/sidebar/sidebar";
import Chat from "@/components/chat/chat";
import { getSidebarState } from "@/lib/utils";

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(getSidebarState());
    const [isSidebarTransitioning, setIsSidebarTransitioning] = useState(false);

    return (
        <ChatContext.Provider
            value={{
                sidebarOpen: { value: isSidebarOpen, fn: setIsSidebarOpen },
                sidebarTransition: { value: isSidebarTransitioning, fn: setIsSidebarTransitioning },
            }}
        >
            <main className="flex min-h-screen items-center justify-between relative">
                <Sidebar />
                <Separator orientation="vertical" className="h-svh" />
                <Chat />
            </main>
        </ChatContext.Provider>
    );
}
