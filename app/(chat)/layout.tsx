"use client";

import ChatPage from "@/components/chat-page";
import { fetchAPI } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthenticationContext } from "@/lib/context-provider";
import { checkAuth } from "@/lib/middleware";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authenticatedUser, setAuthenticatedUser] = useState({ name: "", email: "" });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth(2, (data: any) => {
            setLoading(false);
            setIsAuthenticated(true);
            setAuthenticatedUser({
                name: data.user["name"],
                email: data.user["email"],
            });
        }, (data: any) => {
            setLoading(false);
            console.log(data);
            setIsAuthenticated(false);
            setAuthenticatedUser({
                name: "",
                email: "",
            })
        });
    }, []);

    return (
        <AuthenticationContext.Provider
            value={{
                authenticated: { value: isAuthenticated, fn: setIsAuthenticated },
                authenticatedName: authenticatedUser["name"],
                authenticatedEmail: authenticatedUser["email"],
            }}
        >
            {loading ? <div className="w-svw h-svh absolute top-0 left-0 bg-background z-50"></div> : ""}
            <ChatPage auth={isAuthenticated}>{children}</ChatPage>
        </AuthenticationContext.Provider>
    )

}
