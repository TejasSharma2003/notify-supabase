import Link from "next/link"

import { Skeleton } from "@/components/ui/skeleton"
import { ArticleOperations } from "@/components/article-operations"
import { formatDate } from "@/lib/utils"

interface ArticleItemProps {
    article: {
        id: string,
        title: string,
        is_published: boolean,
        updated_at: string,
        created_at: string
    }

}

export function ArticleItem({ article }: ArticleItemProps) {
    return (
        <div className="flex items-center justify-between p-4">
            <div className="grid gap-1">
                <Link
                    href={`/editor/${article.id}`}
                    className="font-semibold hover:underline"
                >
                    {article.title}
                </Link>
                <div>
                    <p className="text-sm text-muted-foreground">
                        {formatDate(article.created_at)}
                    </p>
                </div>
            </div>
            <ArticleOperations article={{ id: article.id, title: article.title, is_published: article.is_published }} />
        </div>
    )
}

ArticleItem.Skeleton = function ArticleItemSkeleton() {
    return (
        <div className="p-4">
            <div className="space-y-3">
                <Skeleton className="h-5 w-2/5" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        </div>
    )
}

