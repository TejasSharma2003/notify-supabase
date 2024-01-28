import { Suspense } from "react";
import SideSkeletonArticle from "@/components/ui/article/skeletons/side-article-skeleton";
import Article from "@/components/home/article";
import SideArticle from "@/components/home/side-article";
import MainSkeletonArticle from "@/components/ui/article/skeletons/main-skeleton-article";

export const revalidate = 3600 // revalidate date every hour

const IndexPage = () => {
    return (
        <div className='container'>
            <div className="mt-8 mb-12">
                <h1 className="text-3xl underline-offset-4 text-muted-foreground font-heading">Here&apos;s what&apos;s trending...</h1>
            </div>

            {/* main content grid */}
            <div className="flex justify-between gap-x-14">
                <Suspense fallback={<MainSkeletonArticle />}>
                    <Article />
                </Suspense>
                <div>
                    <Suspense fallback={<SideSkeletonArticle />}>
                        <SideArticle />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

export default IndexPage;
