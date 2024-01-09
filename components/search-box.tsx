'use client'

import { SearchIcon } from "lucide-react"
import React from "react"

const SearchBox = () => {
    const [input, setInput] = React.useState<string | null>(null);
    const hashTags = [
        "#BreakingNews",
        "#Headlines",
        "#LatestNews",
        "#TopStories",
        "#WorldNews",
        "#LocalNews",
        "#NationalNews",
        "#GlobalUpdates",
        "#InDepthCoverage",
        "#NewsAlert",
        "#NewsNow",
        "#DailyNews",
        "#CurrentAffairs",
        "#NewsFlash",
        "#LiveUpdates",
        "#Journalism",
        "#MediaWatch",
        "#PressFreedom",
        "#FactCheck",
        "#Reporters",
    ]
    const searchHandler = (e: React.FormEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget;
        setInput(value);
    }
    return (
        <div className="flex justify-center w-full font-sans overflow-hidden">
            <div className="relative z-20 text-center flex flex-col items-center">
                <form className="w-full">
                    <div className="rounded-lg font-sans border flex items-center pl-3 pr-2 w-full" >
                        <SearchIcon width={20} className="text-gray-800" />
                        <input className="w-full text-base placeholder:text-gray-600 focus:outline-none p-2 bg-transparent" type='name' placeholder="Try Searching 'Javascript Developers'" onChange={searchHandler} />
                    </div>
                    <div className="h-3 my-3 flex items-center justify-center">
                        {input && <span className="block text-sm text-gray-500">Search for &apos;{input}&apos;</span> }
                    </div>
                </form>
                <div className="">
                    <p className="text-lg text-gray-800 mb-3">Most trending hashtags</p>
                    <div className="max-w-lg">
                        <ul className="flex justify-center flex-wrap ">
                            {hashTags.map((word, index) => {
                                return <li key={index} className="cursor-pointer m-2 py-[1px] px-[1.5px] rounded-lg bg-gray-100 px-2 py-1 font-medium text-gray-600 hover:bg-gray-200">{word}</li>
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchBox;
