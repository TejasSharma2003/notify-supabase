"use server"

import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase/server";

type getPublicImageUrlProps = {
    authorId: string,
    fileName: string,
}

export async function getPublicImageUrl({ authorId, fileName = "" }: getPublicImageUrlProps) {
    const cookiesStore = cookies();
    const supabase = createServerClient(cookiesStore);
    const bucketName =
        process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_POSTS || "cover-image";
    const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(`${authorId}/${fileName}`);

    if (data && data.publicUrl) {

        // check the image or the assets really exists in the supabase storage
        const url = data.publicUrl;
        const response = await fetch(url, { method: 'HEAD' }); // if response.status is 400 then the assets desn't exists
        if (response.status >= 400) {
            return "/images/not-found.jpg";
        }
        return url
    };

    return "/images/not-found.jpg";
}
