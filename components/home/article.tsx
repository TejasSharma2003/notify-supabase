import Link from "next/link";
import Image from "next/image"
import { v4 } from "uuid";
import { createServerClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";
import { formatDate, shimmer, toBase64 } from "@/lib/utils";
import { cookies } from "next/headers";
import { NUMBER_OF_ROWS } from "@/config/site";
import BottomArticleBar from "./bottom-article-bar";
import { getPublicImageUrl } from "@/actions/images/get-public-url";
import { unstable_noStore } from "next/cache";



const SingleArticle = async ({ article }: { article: Article }) => {
    return (
        <article className="font-sans max-w-[640px]">
            <div className="grid  grid-cols-[1.5fr_1fr] ">
                <div className="relative flex-1 mr-6">
                    <span className="text-sm text-gray-500">
                        {formatDate(article.updated_at)}
                    </span>
                    <h3 className="mt-3 text-2xl text-gray-700 font-semibold leading-8">{article.title}</h3>
                    <Link href={`/news/${article.slug}`} className="absolute inset-0">
                        <span className="sr-only">View Article</span>
                    </Link>
                </div>
                <div className="overflow-hidden rounded ml-auto">
                    <Image
                        src={await getPublicImageUrl({ authorId: article.author_id, fileName: article.cover_image })}
                        alt={article.header_image || "cover"}
                        className="hover:scale-110 w-full h-full transition-transform object-cover"
                        width={240}
                        height={162}
                        placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(240, 162))}`}
                    />
                </div>
            </div>
            <div className="flex mt-4">
                <div className="w-1 rounded bg-primary"></div>
                <div className="ml-2">
                    <span className="text-sm font-semibold text-gray-800">Description</span>
                    <p className="text-base text-gray-700 line-clamp-3">{article.description}</p>
                </div>
            </div>
            <BottomArticleBar article={article} />
        </article>
    )
}


const Article = async () => {
    const cookieStore = cookies();
    const supabase = createServerClient<Database>(cookieStore);

    const { data: articles, error } = await supabase
        .from("articles")
        .select("*")
        .match({ "is_published": true, "always_show": false })
        .order("created_at", { ascending: false })
        .limit(NUMBER_OF_ROWS);

    if (error) {
        return <h1>There is an error</h1>
    };

    if (articles?.length === 0) {
        return <h1>All tasted.</h1>
    }

    return (
        <div className="grid gap-y-14">
            {articles?.map((article) => (
                <SingleArticle key={v4()} article={article} />
            ))}
        </div>
    )
}
export default Article
