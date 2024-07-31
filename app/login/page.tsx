"use client";

import LoginForm from "@/components/login-form-template";
import { fetchAPI } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";
import { checkAuth } from "@/lib/middleware";

export default function Login() {
    const [loadingLogin, setLoadingLogin] = React.useState(true);
    const router = useRouter();

    React.useEffect(() => {
        checkAuth(1, () => {
            router.push("/");
        }, () => {
            setLoadingLogin(false);
        });
    }, []);

    return (
        <>
            {loadingLogin ? <div className="w-svw h-svh absolute top-0 left-0 bg-background z-50"></div> : ""}
            <div className="min-h-screen flex flex-col items-center justify-center">
                <LoginForm />
            </div>
        </>
    );
}
