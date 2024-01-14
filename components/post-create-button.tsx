"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { cn, delay } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { createBrowserClient } from "@/utils/supabase/client"
import { toast } from "./ui/use-toast"


interface PostCreateButtonProps extends ButtonProps { }

export function PostCreateButton({
    className,
    variant,
    ...props
}: PostCreateButtonProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const supabase = createBrowserClient();

    // Todo change this with supabase 
    async function onClick() {
        setIsLoading(true);

        const { data: articleArr, error } = await supabase
            .from('articles')
            .insert({ title: "Untitled" }).select().limit(1);


        if (error) {
            setIsLoading(false);
            return toast(
                {
                    title: "Data insertion",
                    description: "Article can't be created. Please try again!"
                }
            )
        }
        const [article] = articleArr;
        setIsLoading(false)

        // This forces a cache invalidation.
        router.refresh()

        router.push(`/editor/${article.id}`)
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                buttonVariants({ variant }),
                {
                    "cursor-not-allowed opacity-60": isLoading,
                },
                className
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Icons.add className="mr-2 h-4 w-4" />
            )}
            New post
        </button>
    )
}

