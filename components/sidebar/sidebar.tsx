"use client";

import React, { useState } from "react";
import Profile from "@/components/sidebar/profile";
import History from "@/components/sidebar/history";
import Header from "@/components/sidebar/header";

const texts = Array.from({ length: 10 }).map((_, i, a) => `Lorem ipsum sir dolor amet and no one could be in that`);

export default function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isSidebarTransitioning, setIsSidebarTransitioning] = useState(false);

    function sidebarTransition() {
        setIsSidebarTransitioning(true);

        setTimeout(() => setIsSidebarTransitioning(false), 500);
    }

    function openSidebar() {
        setIsSidebarOpen(true);
        sidebarTransition();
    }

    function closeSidebar() {
        setIsSidebarOpen(false);
        sidebarTransition();
    }

    return (
        <section
            className="h-svh flex-shrink-0 transition-all duration-500"
            style={{
                width: isSidebarOpen ? "260px" : "0px",
                opacity: isSidebarOpen ? "1" : "0",
                display: isSidebarTransitioning ? "block" : isSidebarOpen ? "block" : "none",
            }}
        >
            <nav id="sidebar" className="flex flex-col h-full p-1 w-[260px]">
                <div id="top-sidebar" className="flex justify-between items-center p-3">
                    <Header fnCloseSidebar={closeSidebar} />
                </div>
                <h2 className="p-3 font-bold text-sm">History</h2>
                <div id="history-sidebar" className="flex-col flex-1 transition-opacity duration-500 pr-2 overflow-y-auto">
                    <History histories={texts} />
                </div>
                <div id="notify-user w-full">
                    <p className="p-3 text-xs leading-2 text-muted-foreground">
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
