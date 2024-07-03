import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function convertRemToPixels(rem: number) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export async function getChatbotResponse(prompt: string, updateValue: (value: string) => void, afterEffect?: (value: string) => void) {
    try {
        const response = await fetch("http://localhost:8000/api/v1/chat/prompt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: prompt }),
        });

        const reader = (response.body as ReadableStream<Uint8Array>)?.getReader();
        const decoder = new TextDecoder();
        let finalText = "";

        const stream = new ReadableStream({
            start(controller) {
                function push() {
                    reader.read().then(({ done, value }) => {
                        if (done) {
                            controller.close();
                            afterEffect?.(finalText);
                            return;
                        }

                        const chunk = decoder.decode(value, { stream: true });
                        updateValue(chunk);
                        finalText += chunk;
                        push();
                    });
                }

                push();
            },
        });
    } catch (error) {
        console.error(error);
    }
}

export function splitStringIntoChars(string: string): string[] {
    const characters = [];
    const regex = /[\s\S]/g;

    let match;
    while ((match = regex.exec(string)) !== null) {
        characters.push(match[0]);
    }

    return characters;
}


export function saveSidebarState(sidebarOpen: boolean) {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
}

export function getSidebarState(): boolean {
    const sidebarOpen = JSON.parse(localStorage.getItem("sidebarOpen") ?? "false");
    return sidebarOpen;
}
