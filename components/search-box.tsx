'use client'

import { SearchIcon } from "lucide-react"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { Input } from "./ui/input"
import React from "react"
import { Icons } from "./icons"

const SearchBox = () => {
    const searchParams = useSearchParams();
    const [url, setUrl] = React.useState('');
    const router = useRouter();

    const searchHandler = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        const newUrl = `?${params.toString()}`
        setUrl(newUrl);
    }

    const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push(`/search/${url}`);
    }

    return (
        <div className="flex flex-col justify-center w-full font-sans overflow-hidden">
            <form onSubmit={onSubmitHandler}>
                <div className=" font-sans flex items-center pl-3 pr-2 w-full relative mt-2" >
                    <Icons.search className="text-muted-foreground absolute w-4 h-4 ml-2"/>
                    <Input className="w-full text-base p-2 bg-transparent pl-8" type='name' placeholder="Start typing to search..." onChange={(e) => searchHandler(e.target.value)} defaultValue={searchParams.get('query')?.toString()} />
                </div>
            </form>
            <div className="mt-10">
                <h1 className="text-xl text-gray-800 mb-3 font-heading">Recent searches</h1>
                <div>....</div>
                <div>....</div>
                <div>....</div>
                <div>....</div>
                <div>....</div>
                <div>....</div>
            </div>
        </div>
    )
}

export default SearchBox;
