"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatPage from "@/components/chat-page";
import { fetchAPI } from "@/lib/utils";
import Chat from "@/components/chat/chat";

export default function Page({ params }: { params: { uuid: string } }) {
    return <Chat conversationUUID={params.uuid} />;
}
