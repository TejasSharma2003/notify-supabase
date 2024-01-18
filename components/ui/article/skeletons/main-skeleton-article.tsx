const MainArticleItemDesktopLoading = () => {
    return (
        <div
            role="status"
            className="hidden max-w-[640px] flex-col items-center justify-center space-y-8 md:flex" >
            <div className="mx-auto max-w-3xl w-full animate-pulse rounded-md dark:border-gray-700">
                <div className="flex">
                    <div className="mt-4 flex-col mr-4">
                        <div className="mb-4 h-3 bg-gray-200 rounded-full w-20"></div>
                        <div className="mb-2.5 h-3 w-[396px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <div className="mb-2.5 h-3 w-[396px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <div className="mb-2.5 h-3 w-[396px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <span className="sr-only">Loading...</span>
                    </div>
                    <div className="mt-4 flex h-[162px] w-[240px] items-center justify-center rounded bg-gray-300 dark:bg-gray-700">
                        <svg
                            className="h-10 w-10 text-gray-200 dark:text-gray-600"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 16 20"
                        >
                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                        </svg>
                    </div>
                </div>
                <div className="mb-4 h-3 bg-gray-200 rounded-full w-20"></div>
                <div className="mb-2.5 h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="mb-2.5 h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="mb-2.5 h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="mt-4 flex justify-between">
                    <div className="mb-4 h-3 bg-gray-200 rounded-full w-20"></div>
                    <div className="mb-4 h-3 bg-gray-200 rounded-full w-20"></div>
                </div>
            </div>
        </div>
    );
};

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

