"use client";

import ChatPage from "@/components/chat-page";
import { fetchAPI } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthenticationContext } from "@/lib/context-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
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
                        setLoading(false);
                        setIsAuthenticated(true);
                    } else {
                        // router.push("/login");
                    }
                } else {
                    // router.push("/login");
                    setLoading(false);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                // console.error("Failed to check authentication", error);
                setLoading(false);
                setIsAuthenticated(false);
                // router.push("/login");
            }
        };

        checkAuth();
    });

    return (
        <AuthenticationContext.Provider
            value={{
                authenticated: { value: isAuthenticated, fn: setIsAuthenticated },
            }}
        >
            {loading ? <div className="w-svw h-svh absolute top-0 left-0 bg-background z-50"></div> : ""}
            <ChatPage auth={isAuthenticated}>{children}</ChatPage>
        </AuthenticationContext.Provider>
    )

}
