import { notFound } from "next/navigation"

import Image from "next/image"
import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"

import { buttonVariants } from "@/components/ui/button"
import Content from "@/components/content"
import { Icons } from "@/components/icons"
import { cn, formatDate } from "@/lib/utils"
import { Database } from "@/types/supabase"
import { cookies } from "next/headers"
import ArticleScrollUpButton from "@/components/article-scroll-up-button"
import { getPublicImageUrl } from "@/actions/images/get-public-url"

interface PostPageProps {
    params: {
        slug: string[]
    }
}

async function getArticle(params: { slug: string[] }) {
    const slug = params?.slug?.join("/");
    const cookieStore = cookies();
    const supabase = createServerClient<Database>(cookieStore);

    const response = await supabase
        .from("articles")
        .select(`*`)
        .match({ slug: slug, is_published: true })
        .single();

    if (!response.data) {
        notFound;
    }

    return response.data;
}


const updateReadingCount = async (articleId: string) => {
    const cookieStore = cookies();
    const supabase = createServerClient<Database>(cookieStore);

    // updating read count on the article
    await supabase.rpc("increment_reads", { x: 1, articles_id: articleId });
}

export default async function PostPage({ params }: PostPageProps) {
    // fetching the article
    const article = await getArticle(params)
    if (!article) {
        notFound()
    }

    await updateReadingCount(article.id);

    const coverImageUrl = await getPublicImageUrl({ authorId: article.author_id!, fileName: article.cover_image });

    return (
        <article className="container relative max-w-3xl py-6 lg:py-10">
            <Link
                href="/"
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "absolute left-[-200px] top-14 hidden xl:inline-flex"
                )}
            >
                <Icons.chevronLeft className="mr-2 h-4 w-4" />
                See all articles
            </Link>
            <div>
                <time
                    dateTime={article.created_at}
                    className="block text-sm text-muted-foreground" >
                    Published on {formatDate(article.created_at)}
                </time>
                <h1 className="mt-2 inline-block font-heading text-4xl leading-tight">
                    {article.title}
                </h1>
            </div>
            <Image
                src={coverImageUrl}
                alt={article.title}
                width={720}
                height={405}
                className="my-8 rounded-md border bg-muted transition-colors"
                priority
            />
            <Content content={article.content || ""} />
            <hr className="mt-12" />
            <div className="flex justify-center py-6 lg:py-10">
                <Link href="/" className={cn(buttonVariants({ variant: "ghost" }))}>
                    <Icons.chevronLeft className="mr-2 h-4 w-4" />
                    See all articles
                </Link>
            </div>
            <ArticleScrollUpButton />
        </article>
    )
}

