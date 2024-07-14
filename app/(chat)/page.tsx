"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatPage from "@/components/chat-page";
import { fetchAPI } from "@/lib/utils";

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetchAPI("/auth", {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        setIsAuthenticated(true);
                    } else {
                        router.push("/login");
                    }
                } else {
                    router.push("/login");
                }
            } catch (error) {
                console.error("Failed to check authentication", error);
                setIsAuthenticated(false);
                router.push("/login");
            }
        };

        checkAuth();
    });

    if (!isAuthenticated) {
        return;
    }

    return <ChatPage />;
}
