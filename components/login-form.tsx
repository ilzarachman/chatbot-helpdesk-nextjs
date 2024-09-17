"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { set, useForm } from "react-hook-form";
import { z } from "zod";

import { ArrowRight, Router, LoaderCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { fetchAPI } from "@/lib/utils";
import GoogleIcon from "@/assets/google-icon.svg";
import Image from "next/image";
import { useToast } from "./ui/use-toast";

const studentNumberPlaceholder = "Enter your student number";

const studentLoginSchema = z.object({
  studentNumber: z.string().min(1, "Student number is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginForm() {
  const [loadingLogin, setLoadingLogin] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof studentLoginSchema>>({
    resolver: zodResolver(studentLoginSchema),
    defaultValues: {
      studentNumber: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof studentLoginSchema>) {
    console.log(values);
    const login = async () => {
      setLoadingLogin(true);
      try {
        const res = await fetchAPI("/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_number: values.studentNumber,
            password: values.password,
          }),
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data) {
            console.log("success");
            router.push("/");
          }
        } else {
          alert("Failed to login! Please try again.");
          setLoadingLogin(false);
        }
      } catch (error) {
        console.error("Failed to login", error);
        alert("Failed to login! Please try again.");
        setLoadingLogin(false);
      }
    };

    if (values.studentNumber && values.password) {
      login();
    } else {
      console.log("failed");
      alert("Please enter both student number and password");
    }
  }

  function googleSignIn() {
    setLoadingLogin(true);

    fetchAPI("/auth/google-oauth/login", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const redirectUrl = data.redirect_url;

        // Open the redirect URL in a new small window
        const popup = window.open(
          redirectUrl,
          "_blank",
          "popup,scrollbars=yes,height=600,width=600"
        );

        window.addEventListener("message", (event) => {
          if (event.source === popup) {
            setLoadingLogin(false);

            const data = event.data;

            if (data.status !== "none") {
              router.push("/");
            } else {
                toast({
                    title: `Error: ${data.error}`,
                    description: data.desc,
                    variant: "destructive",
                })
            }
          }
        });
      });
  }

  return (
    <Card className="w-[350px] shadow-lg shadow-slate-200">
      <CardContent className="pt-6 gap-5 flex flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="studentNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={studentNumberPlaceholder}
                      type="text"
                      className="focus-visible:ring-[#3498DB]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      type="password"
                      className="focus-visible:ring-[#3498DB]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="default"
              type="submit"
              className="px-6 bg-[#3498DB] hover:bg-[#175782]"
              disabled={loadingLogin}
            >
              Sign in using student number
              {loadingLogin ? (
                <LoaderCircle className="ml-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        {/* <form action={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google-oauth/login`} target="_blank" method="POST"> */}
        <Button
          variant="outline"
          // type="submit"
          type="button"
          disabled={loadingLogin}
          className="w-full gap-3"
          onClick={() => googleSignIn()}
        >
          {loadingLogin ? (
            <LoaderCircle className="ml-2 h-4 w-4 animate-spin" />
          ) : (
            <Image src={GoogleIcon} alt="Google Icon" className="h-4 w-4" />
          )}
          Unesa email
        </Button>
        {/* </form> */}
        <p className="g-paragraph [&:not(:first-child)]:mt-6 text-xs">
          *If you don't have an account, please contact your supervisor.
        </p>
      </CardContent>
    </Card>
  );
}

const staffNumberPlaceholder = "Enter your staff number";

const staffLoginSchema = z.object({
  staffNumber: z.string().min(1, "Staff number is required"),
  password: z.string().min(1, "Password is required"),
});

export function StaffLoginForm() {
  const [loadingLogin, setLoadingLogin] = React.useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof staffLoginSchema>>({
    resolver: zodResolver(staffLoginSchema),
    defaultValues: {
      staffNumber: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof staffLoginSchema>) {
    console.log(values);
    const login = async () => {
      setLoadingLogin(true);
      try {
        const res = await fetchAPI("/auth/staff/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            staff_number: values.staffNumber,
            password: values.password,
          }),
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data) {
            console.log("success");
            router.push("/staff");
          }
        } else {
          alert("Failed to login! Please try again.");
          setLoadingLogin(false);
        }
      } catch (error) {
        console.error("Failed to login", error);
        alert("Failed to login! Please try again.");
        setLoadingLogin(false);
      }
    };

    if (values.staffNumber && values.password) {
      login();
    } else {
      console.log("failed");
      alert("Please enter both student number and password");
    }
  }

  return (
    <Card className="w-[350px] shadow-lg shadow-red-800">
      <CardHeader>
        <CardTitle className="font-bold text-3xl">Login</CardTitle>
        <CardDescription>
          Entering administration room for staff!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="staffNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={staffNumberPlaceholder}
                      type="text"
                      {...field}
                    />
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
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="default"
              type="submit"
              className="px-6 bg-[#3498DB] hover:bg-[#175782]"
              disabled={loadingLogin}
            >
              Login
              {loadingLogin ? (
                <LoaderCircle className="ml-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
