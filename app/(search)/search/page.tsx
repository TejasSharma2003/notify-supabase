import SearchBar from "@/components/search-page/search-bar"
import FilterArticle from "@/components/search-page/filter-article"
import { Suspense } from "react";
import MainSkeletonArticle from "@/components/ui/article/skeletons/main-skeleton-article";
import { Skeleton } from "@/components/ui/skeleton";

function SearchPageArticleSkeletonWrapper() {
    return (
        <div className="flex flex-col items-center mt-10">
            <Skeleton className="w-64 h-10"/>
            <MainSkeletonArticle className="mt-8" />
        </div>

    )

}

export default function QueryResultPage({ searchParams }: {
    searchParams?: {
        query?: string
    }

}) {
    const query = searchParams?.query || '';
    return (
        <div className="max-w-3xl mx-auto">
            <SearchBar />
            {!query && <h1 className="text-2xl text-muted-foreground mt-10">You can access all the news from here.</h1>}
            {query &&
                <Suspense fallback={<SearchPageArticleSkeletonWrapper/>}>
                    <FilterArticle query={query} />
                </Suspense>
            }
        </div>
    )
}
