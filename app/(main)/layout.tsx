import React from "react"
import Navbar from "@/components/navbar"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";
import isUserAuthenticated from "@/lib/auth";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
    const isAuthenticated = await isUserAuthenticated();

    return (
        <>
            <Navbar isAuthenticated={isAuthenticated} />
            <main>
                {children}
            </main>
        </>
    )
}
