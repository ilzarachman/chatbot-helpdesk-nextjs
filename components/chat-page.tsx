"use client";

import React, { useEffect, useState, Suspense } from "react";
import { ChatContext } from "@/lib/context-provider";
import { Separator } from "@/components/ui/separator";
import Sidebar from "@/components/sidebar/sidebar";
import Chat from "@/components/chat/chat";
import { getSidebarState } from "@/lib/utils";
import Loading from "@/components/loading";

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarTransitioning, setIsSidebarTransitioning] = useState(false);

    useEffect(() => {
        setIsSidebarOpen(getSidebarState());
    }, []);

    return (
        <Suspense fallback={<Loading />}>
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
        </Suspense>
    );
}
