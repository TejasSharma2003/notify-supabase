import { notFound } from "next/navigation"

import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { createServerClient } from "@/utils/supabase/server"

import { buttonVariants } from "@/components/ui/button"
import Content from "@/components/content"
import { Icons } from "@/components/icons"
import { cn, formatDate } from "@/lib/utils"
import { Database } from "@/types/supabase"
import { cookies } from "next/headers"

async function getPublicImageUrl(author_id: string, fileName: string) {
    const cookieStore = cookies();
    const supabase = createServerClient<Database>(cookieStore);
    const bucketName =
        process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_POSTS || "cover-image";
    const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(`${author_id}/${fileName}`);

    if (data && data.publicUrl) return data.publicUrl;

    return "/images/not-found.jpg";
}

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


export default async function PostPage({ params }: PostPageProps) {
    const article = await getArticle(params)

    if (!article) {
        notFound()
    }

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
                src={await getPublicImageUrl(article.author_id, article.cover_image)}
                alt={article.title}
                width={720}
                height={405}
                className="my-8 rounded-md border bg-muted transition-colors"
                priority
            />
            <Content content={article.content}/>
            <hr className="mt-12" />
            <div className="flex justify-center py-6 lg:py-10">
                <Link href="/" className={cn(buttonVariants({ variant: "ghost" }))}>
                    <Icons.chevronLeft className="mr-2 h-4 w-4" />
                    See all articles
                </Link>
            </div>
        </article>
    )
}

