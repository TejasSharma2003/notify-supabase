import { notFound, redirect } from "next/navigation"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { DashboardShell } from "@/components/shell"
import { delay } from "@/lib/utils"
import { cookies } from "next/headers"
import { createServerClient } from "@/utils/supabase/server"
import { ArticleItem } from "@/components/article-item"
import { useRouter } from "next/navigation"
import { unstable_noStore as noStore } from "next/cache"
import React from "react"

export const metadata = {
    title: "Dashboard",
}

export default async function DashboardPage({ params, searchParams }: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    noStore();
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    const { data: articles, error } = await supabase.from("articles").select('id, title, updated_at, created_at, is_published');

    if (!articles?.length || error) {
        notFound;
    }

    return (
        <DashboardShell>
            <DashboardHeader heading="Posts" text="Create and manage posts.">
                <PostCreateButton />
            </DashboardHeader>
            <div>
                {articles?.length ? (
                    <div className="divide-y divide-border rounded-md border">
                        {articles.map((article) => (
                            <ArticleItem key={article.id} article={article} />
                        ))}
                    </div>
                ) : (
                    <EmptyPlaceholder>
                        <EmptyPlaceholder.Icon name="post" />
                        <EmptyPlaceholder.Title>No posts created</EmptyPlaceholder.Title>
                        <EmptyPlaceholder.Description>
                            You don&apos;t have any posts yet. Start creating content.
                        </EmptyPlaceholder.Description>
                        <PostCreateButton variant="outline" />
                    </EmptyPlaceholder>
                )}
            </div>
        </DashboardShell>
    )
}

