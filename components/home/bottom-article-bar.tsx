import LikeButton from "../like-button"
import DetailArticleShareButton from "../detail-article-share-button"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"

export function getUrl() {
    if (process.env.NODE_ENV === "development") {
        return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    } else {
        return process.env.NEXT_PUBLIC_WEB_URL || "https://notifyyy.vercel.app";
    }
}

export default function BottomArticleBar({ article }) {
    return (
        <div className="flex items-center justify-between mt-4">
            <span className="text-gray-500">{article.reads}+ reads</span>
            <div className="flex text-sm border rounded-lg">
                <Button variant="ghost" className="flex justify-center">
                    <LikeButton likes={article.likes} articleId={article.id} />
                </Button>
                <Separator orientation="vertical" />
                <DetailArticleShareButton
                    id={article.id as string}
                    title={article.title as string}
                    shares={article.shares as number}
                    description={article.description as string}
                    url={`${getUrl()}${encodeURIComponent(
                        `/articles/${article.slug}`,
                    )}`}
                />
            </div>
        </div>
    )
}
