"use client";

import React, { useState, useContext, useEffect } from "react";
import { ChatContext, sidebarTransition } from "@/lib/context-provider";
import Profile from "@/components/sidebar/profile";
import History from "@/components/sidebar/history";
import Header from "@/components/sidebar/header";
import { saveSidebarState, getSidebarState, fetchAPI } from "@/lib/utils";


type Conversation = {
    uuid: string;
    name: string;
    start_time: string;
}

export default function Sidebar() {
    const { sidebarOpen, sidebarTransition: sidebarTransitionContext } = useContext(ChatContext);
    const [conversations, setConversations] = useState<Conversation[]>([]);

    function getConversations() {
        return fetchAPI("/chat/conversation/all", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                const conversations = data.data.conversations;
                console.log(conversations);
                setConversations([]);
                conversations.forEach((conversation: Conversation) => {
                    setConversations((prev) => [...prev, {uuid: conversation.uuid, name: conversation.name, start_time: conversation.start_time}]);
                });
            });
    }

    React.useEffect(() => {
        getConversations();
    }, []);

    function closeSidebar() {
        sidebarOpen.fn(false);
        sidebarTransition(sidebarTransitionContext);
        saveSidebarState(false);
    }

    return (
        <section
            className="h-svh flex-shrink-0 transition-[width] duration-300 bg-gray-950"
            style={{
                width: sidebarOpen.value ? "300px" : "0px",
                visibility: sidebarTransitionContext.value ? "visible" : sidebarOpen.value ? "visible" : "hidden",
            }}
        >
            <nav id="sidebar" className="flex flex-col h-full p-3 w-[300px] pr-2">
                <div id="top-sidebar" className="flex justify-between items-center p-3">
                    <Header fnCloseSidebar={closeSidebar} />
                </div>
                <h2 className="p-3 font-bold ">History</h2>
                <div id="history-sidebar" className="flex-col flex-1 transition-opacity duration-500 pr-2 overflow-y-auto">
                    <History histories={conversations} />
                </div>
                <div id="notify-user w-full">
                    <p className="p-3 pb-0 pt-4 text-xs leading-2 text-muted-foreground">
                        Please be aware that this feature is currently experimental. We are actively working on improvements and welcome your feedback. Your
                        experience and suggestions are valuable to us in enhancing this service. Thank you for your understanding and support!
                    </p>
                </div>
                <div id="bottom-sidebar">
                    <Profile profileName="Ilza Rachman" />
                </div>
            </nav>
        </section>
    );
}
