"use server"

import { Database } from "@/types/supabase";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";


const deleteArticle = async (articleId: string) => {
    try {
        const cookieStore = cookies();
        const supabase = createServerClient<Database>(cookieStore);


        // delete the article itself
        const { data: deletedArticle, error: delError } = await supabase.from("articles").delete().eq('id', articleId).select().single();
        if (delError) return false;


        // delete the assets such as cover_image from the storage bucket
        const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_COVER_IMAGE || "cover_image"
        const { error: storageErr } = await supabase
            .storage
            .from(bucketName)
            .remove([`${deletedArticle.user_id}/${deletedArticle.cover_image}`])

        if(storageErr) {
            console.log("This is storage error in file delete.ts its a server action", storageErr);
            return false;
        }

        return true;

    } catch (err) {
        console.log(err);
        return false;
    }
}
export default deleteArticle;
