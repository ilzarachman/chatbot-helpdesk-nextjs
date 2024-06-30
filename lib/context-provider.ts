import { createContext } from "react";

type ChatContextValue = {
    sidebarOpen: {
        value: boolean;
        fn: (value: boolean) => void;
    };
    sidebarTransition: {
        value: boolean;
        fn: (value: boolean) => void;
    };
};

export const ChatContext = createContext({} as ChatContextValue);
export function sidebarTransition(sidebarTransition: { value: boolean; fn: (value: boolean) => void }) {
    sidebarTransition.fn(true);
    setTimeout(() => sidebarTransition.fn(false), 300);
}
