import { Suspense } from "react";
import SideSkeletonArticle from "@/components/ui/article/skeletons/side-article-skeleton";
import Article from "@/components/home/article";
import SideArticle from "@/components/home/side-article";
import MainSkeletonArticle from "@/components/ui/article/skeletons/main-skeleton-article";

export const revalidate = 0;

const IndexPage = () => {
    return (
        <div className='container'>
            <div className="mt-8 mb-12">
                <h1 className="text-3xl underline-offset-4 text-gray-700 font-heading">Here&apos;s what&apos;s trending...</h1>
            </div>

            {/* main content grid */}
            <div className="flex justify-between gap-x-14">
                <Suspense fallback={<MainSkeletonArticle />}>
                    <Article />
                </Suspense>
                <div>
                    <h1 className="font-heading text-gray-700 text-2xl mb-8">Recent update&apos;s</h1>
                    <Suspense fallback={<SideSkeletonArticle />}>
                        <SideArticle />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

export default IndexPage;
