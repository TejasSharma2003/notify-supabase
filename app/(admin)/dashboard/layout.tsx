import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <main>
            {children}
        </main>
    )

}
