"use client";

import React from "react";
import { SquareChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import HistoryItem from "@/components/history-item";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquareText } from "lucide-react";

const texts = Array.from({ length: 10 }).map((_, i, a) => `Lorem ipsum sir dolor amet and no one could be in that`);

export default function Sidebar() {
    return (
        <nav id="sidebar" className="flex flex-col h-full p-1">
            <div id="top-sidebar" className="flex justify-between items-center p-3">
                <div className="flex items-center space-x-2">
                    <MessageSquareText className="w-4" />
                    <h1>Helpdesk</h1>
                </div>
                <Button variant="ghost" size="icon" className="translate-x-3">
                    <SquareChevronLeft className="w-4" />
                </Button>
            </div>
            <div id="history-sidebar" className="flex-col flex-1 transition-opacity duration-500  pr-2">
                <h2 className="p-3 font-bold text-sm">History</h2>
                <div className="overflow-y-auto">
                    <div className="h-full w-full">
                        {texts.map((text, i) => (
                            <HistoryItem key={i} text={text} />
                        ))}
                    </div>
                </div>
            </div>
            <div id="bottom-sidebar"></div>
        </nav>
    );
}
