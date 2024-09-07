import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import LoginForm from "@/components/login-form"
import LogoUnesa from "@/assets/logo-unesa.svg"

export const metadata: Metadata = {
    title: "Authentication",
    description: "Authentication forms built using the components.",
}

export default function AuthenticationPage() {
    return (
        <>
            <div className="md:hidden">
                <Image
                    src="/examples/authentication-light.png"
                    width={1280}
                    height={843}
                    alt="Authentication"
                    className="block dark:hidden"
                />
                <Image
                    src="/examples/authentication-dark.png"
                    width={1280}
                    height={843}
                    alt="Authentication"
                    className="hidden dark:block"
                />
            </div>
            <div className="container relative hidden h-svh flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <div className="relative hidden h-full flex-col bg-muted p-10 text-slate-900 dark:border-r lg:flex">
                    <div className="absolute inset-0 bg-[url(https://upload.wikimedia.org/wikipedia/commons/1/14/Gedung_Rektorat_Unesa.jpg)] bg-top" />
                    <Link href="/"className="relative z-20 flex items-center text-lg font-medium gap-3">
                        <Image src={LogoUnesa} alt="Logo Unesa" width={40} />
                        Helpdesk Unesa
                    </Link>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">
                                &ldquo;Growing with character&rdquo;
                            </p>
                        </blockquote>
                    </div>
                </div>
                <div className="lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Login to your student account!
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Enter your student number and password in the fields below
                            </p>
                        </div>
                        
                        <LoginForm />

                    </div>
                </div>
            </div>
        </>
    )
}