"use client";

import React, { useEffect, useState, Suspense } from "react";
import { ChatContext } from "@/lib/context-provider";
import { Separator } from "@/components/ui/separator";
import Sidebar from "@/components/sidebar/sidebar";
import Chat from "@/components/chat/chat";
import { getSidebarState } from "@/lib/utils";
import Loading from "@/components/loading";

export default function Home({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarTransitioning, setIsSidebarTransitioning] = useState(false);
    const [newConvHistory, setNewConvHistory] = useState({title: "", uuid: ""});
    const [chatKey, setChatKey] = useState(0);

    useEffect(() => {
        setIsSidebarOpen(getSidebarState());
    }, []);

    return (
        <Suspense fallback={<Loading />}>
            <ChatContext.Provider
                value={{
                    sidebarOpen: { value: isSidebarOpen, fn: setIsSidebarOpen },
                    sidebarTransition: { value: isSidebarTransitioning, fn: setIsSidebarTransitioning },
                    newConvHistory: { value: newConvHistory, fn: setNewConvHistory },
                    chatKey: { value: chatKey, fn: setChatKey },
                }}
            >
                <main className="flex min-h-screen items-center justify-between relative">
                    <Sidebar />
                    <Separator orientation="vertical" className="h-svh" />
                    {children}
                </main>
            </ChatContext.Provider>
        </Suspense>
    );
}
