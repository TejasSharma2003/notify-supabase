import Navbar from "@/components/navbar"
import isUserAuthenticated from "@/lib/auth";
import React from "react"

type SearchLayoutProps = {
    children: React.ReactNode
}
export default async function SearchLayout({ children }: SearchLayoutProps) {
    const isAuthenticated = await isUserAuthenticated();
    return (
        <>
            <Navbar isAuthenticated={isAuthenticated}/>
            <main className="mt-8">
                {children}
            </main>
        </>
    )
}
