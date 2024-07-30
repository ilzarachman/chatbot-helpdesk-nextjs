"use client";

import React, { useState, useContext, useEffect } from "react";
import { ChatContext, sidebarTransition } from "@/lib/context-provider";
import Profile from "@/components/sidebar/profile";
import History from "@/components/sidebar/history";
import Header from "@/components/sidebar/header";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { saveSidebarState, getSidebarState, fetchAPI } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";


type Conversation = {
    uuid: string;
    name: string;
    start_time: string;
}

export default function Sidebar() {
    const { sidebarOpen, sidebarTransition: sidebarTransitionContext, chatKey } = useContext(ChatContext);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [userProfile, setUserProfile] = useState<any>({});

    const router = useRouter();

    function getConversations() {
        return fetchAPI("/conversation/all", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                const conversations = data.data.conversations;
                console.log(conversations);
                setConversations([]);
                conversations.forEach((conversation: Conversation) => {
                    setConversations((prev) => [...prev, { uuid: conversation.uuid, name: conversation.name, start_time: conversation.start_time }]);
                });
            });
    }

    function getProfile() {
        return fetchAPI("/auth/user", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                setUserProfile(data);
            });
    }

    React.useEffect(() => {
        getConversations();
        getProfile();
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

                <Button className="my-4 p-3 mx-4" onClick={() => {
                    chatKey.fn((prev) => (prev + 1))
                    router.push("/");
                }}>
                    <Plus className="w-4 h-4 mr-2" /> New chat
                </Button>

                <h2 className="p-3 font-bold ">History</h2>
                <div id="history-sidebar" className="flex-col flex-1 transition-opacity duration-500 pr-2 overflow-y-auto">
                    <History histories={conversations} updateHistory={getConversations} />
                </div>

                <div id="notify-user w-full">
                    <p className="p-3 pb-0 pt-4 text-xs leading-2 text-muted-foreground">
                        Please be aware that this feature is currently experimental. We are actively working on improvements and welcome your feedback. Your
                        experience and suggestions are valuable to us in enhancing this service. Thank you for your understanding and support!
                    </p>
                </div>

                <div id="bottom-sidebar">
                    <Profile profileName={userProfile.name} />
                </div>
            </nav>
        </section>
    );
}
