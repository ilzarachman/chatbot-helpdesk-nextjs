"use client";

import LoginForm from "@/components/login-form-template";
import { fetchAPI } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";

export default function Login() {
    const [loadingLogin, setLoadingLogin] = React.useState(true);
    const router = useRouter();

    function checkAuth() {
        fetchAPI("/auth", {
            credentials: "include",
        })
            .then((res) => {
                if (res.ok) {
                    router.push("/");
                } else {
                    setLoadingLogin(false);
                }
            })
            .catch((error) => {
                console.error("Failed to check authentication", error);
            });
    }

    React.useEffect(() => {
        checkAuth();
    }, []);

    return (
        <>
            {/* {loadingLogin ? <div className="w-svw h-svh absolute top-0 left-0 bg-background z-50"></div> : ""} */}
            <div className="min-h-screen flex flex-col items-center justify-center">
                <LoginForm />
            </div>
        </>
    );
}
