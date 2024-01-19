import React from 'react'

type MainLayoutProps = {
    children: React.ReactNode
}

export default async function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-full">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">{children}</div>
            </div>
        </div>
    );
}

