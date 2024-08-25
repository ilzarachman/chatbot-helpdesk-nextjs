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
    newConvHistory: {
        value: {title: string, uuid: string};
        fn: (value: {title: string, uuid: string}) => void; 
    };
    chatKey: {
        value: number;
        fn: (value: number | ((prev: number) => number)) => void;
    };
};

type AuthenticationContextValue = {
    authenticated: {
        value: boolean;
        fn: (value: boolean) => void;
    },
    authenticatedName: string;
    authenticatedEmail: string;
}

export const ChatContext = createContext({} as ChatContextValue);
export const AuthenticationContext = createContext({} as AuthenticationContextValue);

/**
 * Performs a transition on the sidebar by calling the provided function with a boolean value.
 *
 * @param {Object} sidebarTransition - An object containing the current value of the sidebar transition and a function to update the value.
 * @param {boolean} sidebarTransition.value - The current value of the sidebar transition.
 * @param {function} sidebarTransition.fn - A function to update the value of the sidebar transition.
 * @return {void} This function does not return a value.
 */
export function sidebarTransition(sidebarTransition: { value: boolean; fn: (value: boolean) => void }) {
    sidebarTransition.fn(true);
    setTimeout(() => sidebarTransition.fn(false), 300);
}
