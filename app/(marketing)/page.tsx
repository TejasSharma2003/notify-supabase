import Article from "@/components/home/article";
import SideArticle from "@/components/home/side-article";


const IndexPage = () => {
    return (
        <div className='container'>
            <div className="text-center mt-8 mb-12">
                <h1 className="text-4xl underline underline-offset-4 font-heading">Latest updates</h1>
            </div>

            {/* main content grid */}
            <div className="grid grid-cols-main-content-grid gap-10 max-w-7xl mx-auto">
                <Article/>
                <SideArticle/>
            </div>
        </div>
    )
}

export default IndexPage;
