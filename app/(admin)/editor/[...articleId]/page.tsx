import React from "react";
import { notFound, redirect } from "next/navigation"
import { Database } from "@/types/supabase"
import { cookies } from "next/headers"
import { createServerClient } from "@/utils/supabase/server";
import NewEditor from "@/components/new-editor"


interface EditorPageProps {
    params: { articleId: string }
}

export default async function EditorPage({ params }: EditorPageProps) {
    const cookieStore = cookies();
    const supabase = createServerClient<Database>(cookieStore);
    const articleId = params.articleId;

    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user.id) {
        redirect("/login")
    }

    const { data: article } = await supabase.from("articles").select().eq('id', articleId).single();

    if (!article) {
        notFound()
    }

    return <NewEditor article={article} />
}

