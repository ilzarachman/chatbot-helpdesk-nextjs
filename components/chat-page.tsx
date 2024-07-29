import React, { useEffect, useState, Suspense } from "react";
import { ChatContext } from "@/lib/context-provider";
import { Separator } from "@/components/ui/separator";
import Sidebar from "@/components/sidebar/sidebar";
import Chat from "@/components/chat/chat";
import { getSidebarState } from "@/lib/utils";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import {ArrowRightFromLine} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatPage({ children, auth: isLoggedIn = true }: { children: React.ReactNode, auth?: boolean }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarTransitioning, setIsSidebarTransitioning] = useState(false);
    const [newConvHistory, setNewConvHistory] = useState({ title: "", uuid: "" });
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
                {isLoggedIn ? <LoggedIn>{children}</LoggedIn> : <NotLoggedIn>{children}</NotLoggedIn>}
            </ChatContext.Provider>
        </Suspense>
    );
}


function LoggedIn({ children }: { children: React.ReactNode }) {
    return (<main className="flex min-h-screen items-center justify-between relative">
        <Sidebar />
        <Separator orientation="vertical" className="h-svh" />
        {children}
    </main>);
}


function NotLoggedIn({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (<main className="flex min-h-screen items-center justify-between relative">
        <Button variant="secondary" onClick={() => router.push("/login")} className="absolute top-8 right-8 z-40 flex gap-2 items-center">Login <ArrowRightFromLine className="w-4" /></Button>
        {children}
    </main>);
}