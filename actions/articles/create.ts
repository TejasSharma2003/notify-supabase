"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"
import { Database } from "@/types/supabase"

interface createAriticleProps {
    id: string
    title: string,
    content: string,
    description: string,
    slug: string
}

export default async function createArticle(article: createAriticleProps) {
    try {
        const cookieStore = cookies();
        const supabase = createServerClient<Database>(cookieStore);

        const { error } = await supabase.from("articles").update({
            title: article.title,
            slug: article.slug,
            description: article.description,
            content: article.content,
        }).eq('id', article.id).select();

        if (error) {
            return null;
        }
        return true;

    } catch (error) {
        console.log(error);
        return null
    }

}
