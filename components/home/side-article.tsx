import { NUMBER_OF_SIDEARTICLES } from "@/config/site"
import { Database } from "@/types/supabase"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import Link from "next/link"
import Image from "next/image"
import { v4 } from 'uuid'
import BottomArticleBar from "./bottom-article-bar"
import { getPublicImageUrl } from "@/actions/images/get-public-url"

const SingleSideArticle = async ({ article }: { article: Article }) => {
    return (
        <article className="font-sans max-w-[637px]">
            <div className="grid  grid-cols-[1fr_1.5fr] gap-y-2">
                <div className="ml-5">
                    <div className="relative">
                        <h3 className="my-2 text-base leading-6 line-clamp-1">{article.title}</h3>
                        <p className="line-clamp-2 text-gray-700 text-sm">{article.description}</p>
                        <Link href={`/news/${article.slug}`} className="absolute inset-0">
                            <span className="sr-only">View Article</span>
                        </Link>
                    </div>
                    <BottomArticleBar article={article} />
                </div>
                <div className="rounded overflow-hidden order-first">
                    <Image
                        src={await getPublicImageUrl({ authorId: article.author_id, fileName: article.cover_image })}
                        className="block hover:scale-110 transition-transform object-cover  h-full"
                        alt="cover-image"
                        width={204}
                        height={137}
                    />
                </div>
            </div>
        </article>
    )

}

const SideArticle = async () => {
    const cookieStore = cookies();
    const supabase = createServerClient<Database>(cookieStore);

    const { data: articles, error } = await supabase
        .from("articles")
        .select("*")
        .match({ "is_published": true, "always_show": true })
        .order("created_at", { ascending: false })
        .limit(NUMBER_OF_SIDEARTICLES);

    if (error) {
        return <h1>There is an error</h1>
    };

    if (articles?.length === 0) {
        return <h1>All tasted.</h1>
    }

    return (
        <div className="sticky top-0 self-start max-w-lg">
            <div className="grid gap-10">
                {articles.map((article) => (
                    <SingleSideArticle key={v4()} article={article} />
                ))}
            </div>
        </div>
    )
}
export default SideArticle;
