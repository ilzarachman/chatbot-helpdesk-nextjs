"use client";

import React, { useState } from "react";
import { Separator } from "@/components/ui/separator"
import Sidebar from "@/components/sidebar"

export default function Home() {
    return (
        <main className="flex min-h-screen items-center justify-between space-x-2 relative">
            <section className="w-[260px] h-svh flex-shrink-0">
                <Sidebar />
            </section>
            <Separator orientation="vertical" className="h-svh"/>
            <section className="w-full p-4 h-svh">
                <h1>Chat</h1>
            </section>
        </main>
    );
}
