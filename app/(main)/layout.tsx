import React from "react"
import Navbar from "@/components/navbar"
import RespectNavbar from "@/components/respect-navbar"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = cookies();
    const supabase = createServerClient<Database>(cookieStore);

    const { data: { session } } = await supabase.auth.getSession();

    let token = "";

    if (session?.access_token) {
        token = session.access_token
    }

    return (
        <main>
            <Navbar token={token} />
            <RespectNavbar>
                {children}
            </RespectNavbar>
        </main>
    )
}
