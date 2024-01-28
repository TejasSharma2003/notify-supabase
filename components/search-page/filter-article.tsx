import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";
import { SingleArticle } from "../home/article";
import { v4 } from "uuid";
import { EmptyPlaceholder } from "../empty-placeholder";
import { delay } from "@/lib/utils";


function ArticleNotFound() {
    return <EmptyPlaceholder className="mt-8 mx-auto max-w-[800px]">
        <EmptyPlaceholder.Icon name="warning" />
        <EmptyPlaceholder.Title>Uh oh! Not Found</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
            This post cound not be found. Please try again.
        </EmptyPlaceholder.Description>
    </EmptyPlaceholder>
}

export default async function FilterArticle({ query }: { query?: string }) {
    await delay(3000);
    const cookieStore = cookies();
    const supabase = createServerClient<Database>(cookieStore);

    // const { data: articles, error } = await supabase.from("articles").select().textSearch("title", `${query}`);
    const { data: articles, error } = await supabase.from("articles").select("*");

    if (error) {
        console.log(error);
        return <h1>There's something wrong sorry. come back later</h1>
    }


    if (!articles.length) {
        return <ArticleNotFound />
    }

    return (
        <div className="mt-10">
            <h1 className="font-heading text-3xl text-black/50 text-center mb-4">Result for <span className="text-black">{query}</span></h1>
            <div className="flex flex-col items-center gap-y-10 border border-dashed py-10 rounded-lg">
                {articles.map((article) => <SingleArticle key={v4()} article={article} />)}
            </div>
        </div>

    );

}

