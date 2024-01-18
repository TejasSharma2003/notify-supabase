"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"
import { Database } from "@/types/supabase";

type unLikeArticleProps = {
    articleId: string,
    likes: number
}
export default async function unLikeArticle(context: unLikeArticleProps) {
    try {
        const cookieStore = cookies();
        const supabase = createServerClient<Database>(cookieStore);
        if (context.likes <= 0) return false;
        const { error } = await supabase.rpc('decrement', { x: 1, articles_id: context.articleId })
        if (error) {
            console.log(error);
            return false;
        }
        return true;

    } catch (err) {
        return false;
    }
}

