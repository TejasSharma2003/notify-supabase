"use server"
import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";

const publishArticle = async (articleId: string) => {
    try {
        const cookieStore = cookies();
        const supabase = createServerClient<Database>(cookieStore);

        const { data: article, error } = await supabase.from("articles").select().eq("id", articleId).single();
        if (error) return false

        if (article?.is_published) {
            // unpublish the article
            const { error } = await supabase.from("articles").update({ is_published: false }).eq("id", articleId);
            if (error) return false
        } else {
            // publish the post
            const { error } = await supabase.from("articles").update({ is_published: true }).eq("id", articleId);
            if (error) return false
        }
        return true;
    }catch(err) {
        console.log(err);
        return false;
    }
}

export default publishArticle;
