'use client'
import Link from "next/link";
import { Button } from "./ui/button";
import clsx from "clsx";
import { SearchIcon } from 'lucide-react';

const Navbar = () => {
    return (
        <div className="border-b border-b-border">
            <nav className="font-sans flex container items-center py-5">
                <Link href="/" className="w-2/6">
                    <h1 className="text-4xl font-bold  text-zinc-700 ">notify<span className="text-primary">.</span></h1>
                </Link>
                <div className="w-2/6 text-xs font-semibold flex justify-center text-gray-500">
                    <span>
                        <span>
                            Call Us <span className="text-gray-600">(</span>91<span className="text-zinc-400">)</span>9832352589
                        </span>
                        <span className="mx-2">/</span>
                        <span>
                            hellonotify@gmail.com
                        </span>
                    </span>
                </div>
                <div className="flex items-center justify-end w-2/6 text-gray-900">
                    <Button className={clsx(' mr-7')}>
                        Suscribe to newsletter
                    </Button>
                    <span>
                        <SearchIcon width={20} />
                    </span>
                    <div className="w-[1px] h-5 mx-5 bg-gray-400"></div>
                    <div className="flex items-center text-sm">
                        <span>Menu</span>
                        <div className="ml-2 ">
                            <span className="block w-7 h-[2px] mb-[5px] bg-gray-900 rounded"></span>
                            <span className="block w-3 h-[2px] bg-gray-900 rounded"></span>
                        </div>
                    </div>
                </div>
            </nav >
        </div>
    )
}

export default Navbar;
