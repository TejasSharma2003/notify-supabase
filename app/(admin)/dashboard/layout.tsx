import React from 'react'
import { RedirectType, redirect } from 'next/navigation'
import Navbar from '@/components/navbar'
import RespectNavbar from '@/components/respect-navbar'
import { DashboardNav } from '@/components/dashboard-nav'
import { dashboardConfig } from "@/config/dashboard"
import { cookies } from 'next/headers'
import { createServerClient } from "@/utils/supabase/server"
import { delay } from '@/lib/utils'


const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const cookieStore = cookies();
    const supabase = createServerClient(cookieStore);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user.id) {
        redirect("/login");
    }

    return (
        <div>
            <Navbar token={session.access_token}/>
            <RespectNavbar>
                <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
                    <aside className="hidden w-[200px] flex-col md:flex">
                        <DashboardNav items={dashboardConfig.sidebarNav} />
                    </aside>
                    <main className="flex w-full flex-1 flex-col overflow-hidden">
                        {children}
                    </main>
                </div>
            </RespectNavbar>
        </div>


    )
}

export default DashboardLayout; 
