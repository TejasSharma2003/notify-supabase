import React from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Navbar from '@/components/navbar'
import RespectNavbar from '@/components/respect-navbar'
import { createServerClient } from "@/lib/supabase/server"
import isUserAuthenticated from '@/lib/auth'


const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = await isUserAuthenticated();

    if (!isUserAuthenticated) {
        redirect("/login");
    }

    return (
        <div>
            <Navbar isAuthenticated={isAuthenticated}/>
                <main className="max-w-4xl mx-auto mt-8 flex w-full flex-1 flex-col overflow-hidden">
                    {children}
                </main>
        </div>


    )
}

export default DashboardLayout; 
