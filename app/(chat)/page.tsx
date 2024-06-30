"use client";

import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import Sidebar from "@/components/sidebar/sidebar";

export default function Home() {
    return (
        <main className="flex min-h-screen items-center justify-between space-x-2 relative">
            <Sidebar />
            <Separator orientation="vertical" className="h-svh" />
            <section className="w-full p-4 h-svh bg-gray-950 z-10">
                <h1>Chat</h1>
            </section>
        </main>
    );
}
