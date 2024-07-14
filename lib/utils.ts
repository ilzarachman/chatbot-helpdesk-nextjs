import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Converts a value in rem units to pixels.
 *
 * @param {number} rem - The value in rem units to be converted.
 * @return {number} The converted value in pixels.
 */
export function convertRemToPixels(rem: number) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

/**
 * Fetches data from the API based on the input URL and initialization options.
 *
 * @param {string | URL} input - The URL or string representing the API endpoint.
 * @param {RequestInit} [init] - Optional initialization options for the fetch request.
 * @return {Promise<Response>} A promise that resolves to the response from the API.
 */
export async function fetchAPI(input: string | URL, init?: RequestInit) {
    const api_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const url = new URL(`/api/v1${input}`, api_url);
    const response = fetch(url, init);
    return response;
}

/**
 * Asynchronously sends a prompt to the chatbot API and streams the response back to the client.
 *
 * @param {string} prompt - The message to send to the chatbot API.
 * @param {(value: string) => void} updateValue - A callback function that updates the client with the current response.
 * @param {(value: string) => void} [afterEffect] - An optional callback function that is called after the response is complete.
 * @return {Promise<void>} A Promise that resolves when the response is complete.
 */
export async function getChatbotResponse(prompt: string, updateValue: (value: string) => void, afterEffect?: (value: string) => void) {
    try {
        const response = await fetchAPI(`/chat/prompt`, {
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

/**
 * Splits a string into an array of characters.
 *
 * @param {string} string - The input string to be split.
 * @return {string[]} An array of characters extracted from the input string.
 */
export function splitStringIntoChars(string: string): string[] {
    const characters = [];
    const regex = /[\s\S]/g;

    let match;
    while ((match = regex.exec(string)) !== null) {
        characters.push(match[0]);
    }

    return characters;
}

/**
 * A function to save the state of the sidebar to the local storage.
 *
 * @param {boolean} sidebarOpen - The boolean value indicating whether the sidebar is open or closed.
 * @return {void} No return value.
 */
export function saveSidebarState(sidebarOpen: boolean) {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
}

/**
 * A function to get the state of the sidebar from local storage.
 *
 * @return {boolean} The boolean value representing the state of the sidebar.
 */
export function getSidebarState(): boolean {
    const sidebarOpen = JSON.parse(localStorage.getItem("sidebarOpen") ?? "false");
    return sidebarOpen;
}
