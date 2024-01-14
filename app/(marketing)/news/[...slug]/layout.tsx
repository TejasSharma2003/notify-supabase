// import { DetailArticleHeader } from "@/components/detail/article";
import type { Database } from "@/types/supabase";
import { createServerClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

async function getArticle(params: { slug: string[] }) {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);
    const slug = params?.slug?.join("/");

  if (!slug) {
        notFound;
    }

    const response = await supabase
        .from("articles")
        .select(`*`)
        .match({ slug: slug, is_published: true })

    if (!response.data) {
        notFound;
    }

    return response.data;
}

export default async function MainLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: {
        slug: string[];
    };
}) {
    const article = await getArticle(params);


    if (!article) {
        notFound();
    }
    return (
        <>
            <div className="min-h-full">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">{children}</div>
                </div>
            </div>
        </>
    );
}

