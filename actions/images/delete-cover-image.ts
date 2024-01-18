"use server";

import { imageDeleteSchema } from "@/lib/validations/image";
import { Database } from "@/types/supabase"
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import * as z from "zod";

export async function deleteCoverImage(
    context: z.infer<typeof imageDeleteSchema>,
) {
    const cookieStore = cookies();
    const supabase = createServerClient<Database>(cookieStore);
    const { authorId, articleId, coverImage } = imageDeleteSchema.parse(context);
    try {
        const { authorId, coverImage } = imageDeleteSchema.parse(context);
        const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_COVER_IMAGE || "cover-image";

        // remove the image from the storage 
        const { data, error: storageError } = await supabase.storage
            .from(bucketName)
            .remove([`${authorId}/${coverImage}`]);

        if (storageError) {
            return {
                error: "Trying to delete nonexistent image."
            }
        }
        // null out the name of the image in articles table
        const { error } = await supabase.from("articles").update({ cover_image: "" }).eq("id", articleId);

        if (error) {
            console.log("Something bad happened here!");
            return false;
        }
        if (data?.length && data?.length > 0) {
            return true;

        } else {
            return false;
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.log(error);
            return false;
        }
        return false;
    }
}

