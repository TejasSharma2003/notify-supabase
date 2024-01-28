'use client'
import { Input } from "../ui/input"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from 'use-debounce';
import { Icons } from "../icons";
import { useEffect, useRef, useState } from "react";

export default function SearchBar() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [isInputEmpty, setIsInputEmpty] = useState(true);

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        setIsInputEmpty(false);
        if (term) {
            params.set('query', term);
        } else {
            setIsInputEmpty(true);
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300)

    return (
        <div className="sticky top-[90px] z-50">
            <div className="flex items-center relative">
                <Icons.search className="absolute left-0 w-4 h-4 text-muted-foreground ml-2"  />
                <Input className="shadow-sm pl-8 text-base" type="text" placeholder="Start typing to search..."
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get('query')?.toString()}
                />
            </div>
            {/* {isInputEmpty && */}
            {/*     <div className="mt-8"> */}
            {/*         <h1 className="text-2xl font-heading ">Recent Searches</h1> */}
            {/*         <div className="mt-4 flex gap-y-4 flex-col text-"> */}
            {/*             <div className="flex justify-between text-gray-500"> */}
            {/*                 <span>Javacript</span> */}
            {/*                 <span className="-rotate-[140deg]" onClick={onSetInputField}><Icons.arrowRight className=""/></span> */}
            {/*             </div> */}
            {/*         </div> */}
            {/*     </div> */}
            {/* } */}
        </div>

    )
}

