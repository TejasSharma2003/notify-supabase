import React from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Navbar from '@/components/navbar'
import RespectNavbar from '@/components/respect-navbar'
import { createServerClient } from "@/lib/supabase/server"


const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);

    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
        redirect("/login");
    }

    return (
        <div>
            <Navbar token={session.access_token}/>
            <RespectNavbar>
                <main className="max-w-4xl mx-auto flex w-full flex-1 flex-col overflow-hidden">
                    {children}
                </main>
            </RespectNavbar>
        </div>


    )
}

export default DashboardLayout; 
