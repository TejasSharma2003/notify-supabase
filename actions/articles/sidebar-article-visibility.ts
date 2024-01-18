"use server"

import { Database } from "@/types/supabase"
import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

type ToogleSidebarVisibilityProps = {
    articleId: string
    always_show: boolean
}
export async function showArticleInSidebar(context: ToogleSidebarVisibilityProps) {
    try {
        if (context.always_show) {
            return null;
        }
        const cookieStore = cookies();
        const supabase = createServerClient<Database>(cookieStore);
        const { error } = await supabase.from("articles").update({ always_show: true }).eq("id", context.articleId);
        if (error) {
            return null;
        }
        return true;
    } catch (err) {
        return null;
    } finally {
        revalidatePath('/');
    }
}

export async function hideArticleFromSidebar(context: ToogleSidebarVisibilityProps) {
    try {
        if (!context.always_show) {
            return null;
        }
        const cookieStore = cookies();
        const supabase = createServerClient<Database>(cookieStore);
        const { error } = await supabase.from("articles").update({ always_show: false }).eq("id", context.articleId);
        console.log(error);
        if (error) {
            return null;
        }
        return true;
    } catch (err) {
        return null;
    } finally {
        revalidatePath('/');
    }
}
