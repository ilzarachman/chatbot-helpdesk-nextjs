"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

const studentNumberPlaceholder = "Enter your student number";

const loginSchema = z.object({
    studentNumber: z.string().min(1, "Student number is required"),
    password: z.string().min(1, "Password is required"),
});

export default function LoginForm() {
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            studentNumber: "",
            password: "",
        },
    });

    function onSubmit(values: z.infer<typeof loginSchema>) {
        console.log(values);
    }

    return (
        <Card className="w-[350px] shadow-lg shadow-slate-900">
            <CardHeader>
                <CardTitle className="font-bold text-3xl">Login</CardTitle>
                <CardDescription>You are entering chatbot application, please enter your credentials.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="studentNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Student number</FormLabel>
                                    <FormControl>
                                        <Input placeholder={studentNumberPlaceholder} type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button variant="default" type="submit" className="px-6">Login <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </form>
                </Form>
                <p className="g-paragraph [&:not(:first-child)]:mt-6 text-xs">
                    *If you don't have an account, please contact your supervisor.
                </p>
            </CardContent>
        </Card>
    );
}
