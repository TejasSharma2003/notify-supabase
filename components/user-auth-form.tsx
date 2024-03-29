"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"

// import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { userAuthSchema } from "@/lib/validations/auth"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

// supabase authentication
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from 'next/navigation'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
    forLogin?: boolean
}

type FormData = z.infer<typeof userAuthSchema>

export function UserAuthForm({ className, forLogin, ...props }: UserAuthFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(userAuthSchema) });
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [isGoogleLoading, setIsGitHubLoading] = React.useState<boolean>(false)
    const supabase = createBrowserClient();
    const router = useRouter();

    async function onSubmit(data: FormData) {
        if (!forLogin) {
            console.log(data);
            const { data: res, error } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
            })
            console.log(error);
            console.log(res);
            return;
        }
        setIsLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        })
        if (error) {
            setIsLoading(false);
            return toast({
                title: "Auth error",
                description: error?.message,
                variant: "destructive",
            })
        }
        setIsLoading(false);
        router.refresh();
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading || isGoogleLoading}
                            {...register("email")}
                        />
                        {errors?.email && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                        <Label className="sr-only" htmlFor="password">
                            password
                        </Label>
                        <Input
                            id="password"
                            placeholder="your password"
                            type="password"
                            disabled={isLoading || isGoogleLoading}
                            {...register("password")}
                        />
                        {errors?.password && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <button className={cn(buttonVariants())} disabled={isLoading || isGoogleLoading}>
                        {(isLoading || isGoogleLoading) && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {forLogin ? <span> Sign In with Credentials </span>
                            :
                            <span> Sign Up with Credentials </span>}
                    </button>
                </div>
            </form>
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
            <button
                type="button"
                className={cn(buttonVariants({ variant: "outline" }))}
                onClick={() => {
                    setIsGitHubLoading(true)
                }}
                disabled={isLoading || isGoogleLoading}
            >
                {isGoogleLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Icons.google className="mr-2 h-4 w-4" />
                )}{" "}
                Google
            </button>
        </div>
    )
}

