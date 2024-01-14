import MainArticleItemDesktopLoading from "../main-article-item-desktop-loading";

const MainSkeletonArticle = () => {
    return (
        <>
            {/* LoadingItems */}
            <div className="flex flex-col">
                <MainArticleItemDesktopLoading />
                <MainArticleItemDesktopLoading />
                <MainArticleItemDesktopLoading />
                <MainArticleItemDesktopLoading />
                <MainArticleItemDesktopLoading />
            </div>
        </>
    );
};

export default MainSkeletonArticle;;

