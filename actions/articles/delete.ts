"use server"

import { createServerClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";


const deleteArticle = async (articleId: string) => {
    try {
        const cookieStore = cookies();
        const supabase = createServerClient(cookieStore);

        const { error } = await supabase.from("articles").delete().eq('id', articleId);
        if (error) return false;
        return true;

    } catch (err) {
        console.log(err);
    }


}
export default deleteArticle;
