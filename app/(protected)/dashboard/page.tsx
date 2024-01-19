import { notFound } from "next/navigation"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { PostCreateButton } from "@/components/post-create-button"
import { DashboardShell } from "@/components/shell"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"
import { ArticleItem } from "@/components/article-item"
import { unstable_noStore as noStore } from "next/cache"
import React from "react"
import { Database } from "@/types/supabase"

export const metadata = {
    title: "Dashboard",
}

export default async function DashboardPage() {
    noStore();
    const cookieStore = cookies();
    const supabase = createServerClient<Database>(cookieStore);

    const { data: { session } } = await supabase.auth.getSession();

    const authorId = session?.user.id!;

    const { data: articles, error } = await supabase
        .from("articles")
        .select('id, title, updated_at, created_at, is_published, always_show')
        .order('created_at', { ascending: false })
        .eq('user_id', authorId);

    if (!articles?.length || error) {
        notFound;
    }

    return (
        <DashboardShell>
            <DashboardHeader heading="Articles" text="Create and manage your articles.">
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
                        <EmptyPlaceholder.Title>Create articles and manage from here.</EmptyPlaceholder.Title>
                        <EmptyPlaceholder.Description>
                            You don&apos;t have any articles yet. Start creating content.
                        </EmptyPlaceholder.Description>
                        <PostCreateButton variant="outline" />
                    </EmptyPlaceholder>
                )}
            </div>
        </DashboardShell>
    )
}

