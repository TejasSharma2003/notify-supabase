import Link from "next/link";
import Image from "next/image"
import { notFound } from "next/navigation";
import { v4 } from "uuid";
import { createServerClient } from "@/utils/supabase/server";
import { Database } from "@/types/supabase";
import { shimmer, toBase64, formatDate } from "@/lib/utils";
import { cookies } from "next/headers";
import { NUMBER_OF_ROWS } from "@/config/site";
import likeArticle from "@/actions/articles/like-article";
import LikeButton from "../like-button";
import { delay } from '@/lib/utils'


async function getPublicImageUrl(article: {
    id: string,
    author_id: string,
}, fileName: string) {
    const cookiesStore = cookies();
    const supabase = createServerClient(cookiesStore);
    const bucketName =
        process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_POSTS || "cover-image";
    const { data } = await supabase.storage
        .from(bucketName)
        .getPublicUrl(`${article.author_id}/${fileName}`);

    if (data && data.publicUrl) return data.publicUrl;

    return "/images/not-found.jpg";
}


const SingleArticle = async ({ article }: { article: Article }) => {
    return (
        <article className="font-sans max-w-[637px]">
            <div className="flex">
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
                        src={await getPublicImageUrl({ id: article.id, author_id: article.author_id }, article.cover_image)}
                        alt={article.header_image || "cover"}
                        className="hover:scale-110 transition-transform w-[240px] h-[162px] object-cover"
                        width={240}
                        height={162}
                    />
                </div>
            </div>
            <div className="flex mt-4">
                <div className="w-1 rounded bg-primary"></div>
                <div className="ml-2">
                    <span className="text-sm font-semibold text-gray-800">Description</span>
                    <p className="text-base text-gray-700">{article.description}</p>
                </div>
            </div>
            <div className="relative text-start mt-2">
                <span className="text-sm  underline underline-offset-4">Read more</span>
                <Link href={`/news/${article.slug}`} className="absolute inset-0">
                    <span className="sr-only">View Article</span>
                </Link>
            </div>
            <div className="flex justify-between mt-2">
                <span className="text-gray-500">{article.reads}+ reads</span>
                <div className="flex text-sm">
                    <LikeButton likes={article.likes} articleId={article.id} />
                    <span className="ml-3 flex items-center">
                        <img src="/whatsapp.png" className="w-[23px] h-[23px]" />
                        <span className="ml-1">{article.shares}</span>
                    </span>
                </div>
            </div>
        </article>
    )
}


const Article = async () => {
    const cookieStore = cookies();
    const supabase = createServerClient<Database>(cookieStore);

    const { data: articles, error } = await supabase.from("articles").select("*").match({ "is_published": true }).limit(NUMBER_OF_ROWS);

    if (error) {
        return <h1>There is an error</h1>
    };

    if (articles?.length === 0) {
        return <h1>All tasted.</h1>
    }

    return (
        <div className="grid gap-14">
            {articles?.map((article) => (
                <SingleArticle key={v4()} article={article} />
            ))}
        </div>
    )
}
export default Article
