import React from "react"
import Navbar from "@/components/navbar"
import RespectNavbar from "@/components/respect-navbar"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
    return (
        <main>
            <Navbar />
            <RespectNavbar>
                {children}
            </RespectNavbar>
        </main>
    )
}
