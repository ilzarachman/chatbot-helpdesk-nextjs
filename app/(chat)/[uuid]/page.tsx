"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatPage from "@/components/chat-page";
import { fetchAPI } from "@/lib/utils";
import Chat from "@/components/chat/chat";

export default function Page({ params }: { params: { uuid: string } }) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    React.useEffect(() => {
        fetchAPI(`/conversation/messages/${params.uuid}`, {
            credentials: "include",
        })
            .then((res) => {
                if (res.ok) {
                    res.json().then((data) => {
                        setLoading(false);
                    })
                } else {
                    router.push("/");
                }
            }).catch((error) => {
                router.push("/");
            });
    }, [])

    return (
        <>
            <Chat conversationUUID={params.uuid} />
        </>
    );
}
