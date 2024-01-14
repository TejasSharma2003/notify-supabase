"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@/utils/supabase/server"
import { Database } from "@/types/supabase";

export default async function likeArticle(articleId: string) {
    try {
        const cookieStore = cookies();
        const supabase = createServerClient<Database>(cookieStore);
        const { data, error } = await supabase.rpc('increment', { x: 1, articles_id: articleId })
        if (error) {
            console.log(error);
            return false;
        }
        return true;

    } catch (err) {
        return false;
    }

}
