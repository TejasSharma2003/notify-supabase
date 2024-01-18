'use client'

import { SearchIcon } from "lucide-react"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import React from "react"

const SearchBox = () => {
    const [input, setInput] = React.useState<string | null>(null);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const searchHandler = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        const newUrl = `/search?${params.toString()}`
        window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl)
        // replace(`${pathname}?${params.toString()}`);
    }
    return (
        <div className="flex flex-col justify-center w-full font-sans overflow-hidden">
            <form className="">
                <div className="rounded-lg font-sans border flex items-center pl-3 pr-2 w-full" >
                    <SearchIcon width={20} className="text-gray-800" />
                    <input className="w-full text-base placeholder:text-gray-600 focus:outline-none p-2 bg-transparent" type='name' placeholder="Try Searching 'Javascript Developers'" onChange={(e) => searchHandler(e.target.value)} defaultValue={searchParams.get('query')?.toString()} />
                </div>
                <div className="h-3 my-3 flex items-center justify-center">
                    {input && <span className="block text-sm text-gray-500">Search for &apos;{input}&apos;</span>}
                </div>
            </form>
            <div className="">
                <p className="text-lg text-gray-800 mb-3">Your&apos;s recent searches</p>
                {/* <div className="max-w-lg"> */}
                {/*     <ul className="flex justify-center flex-wrap "> */}
                {/*         {hashTags.map((word, index) => { */}
                {/*             return <li key={index} className="cursor-pointer m-2 py-[1px] px-[1.5px] rounded-lg bg-gray-100 px-2 py-1 font-medium text-gray-600 hover:bg-gray-200">{word}</li> */}
                {/*         })} */}
                {/*     </ul> */}
                {/* </div> */}
            </div>
        </div>
    )
}

export default SearchBox;
