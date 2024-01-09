import React from 'react'
import Link from 'next/link'

const Logo = () => {
    return (
        <Link href="/" className="w-2/6">
            <h1 className="text-4xl font-bold text-gray-900 font-heading">notify<span className="text-primary">.</span></h1>
        </Link>
    )
}

export default Logo
