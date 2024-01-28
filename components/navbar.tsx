'use client'
import Logo from "./logo";
import React from "react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import SearchBox from "@/components/search-box";
import SideNavbar from "./side-navbar";
import { createBrowserClient } from "@/lib/supabase/client";
import { toast } from "./ui/use-toast";
import { Button, buttonVariants } from "./ui/button";
import { SheetTrigger, Sheet, SheetContent } from "./ui/sheet";
import { Icons } from "./icons";

type NavbarProps = {
    isAuthenticated: boolean
}

const Navbar = (context: NavbarProps) => {
    const supabase = createBrowserClient();
    const router = useRouter();
    const pathname = usePathname();

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            return toast({
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
                variant: "destructive"
            })
        }
        router.refresh();
    }


    return (
        <header className="sticky top-0 w-full bg-white z-[500] border-b border-b-border">
            <nav className="font-sans flex container items-center py-5">
                <Logo />
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
                    {!pathname.includes("search") &&
                        <>
                            <Dialog>
                                <DialogTrigger>
                                    <span className="cursor-pointer">
                                        <Icons.search width={20} />
                                    </span>
                                </DialogTrigger>
                                <DialogContent className="">
                                    <SearchBox />
                                </DialogContent>
                            </Dialog>
                            <div className="w-[1px] h-5 mx-5 bg-gray-400"></div>
                        </>
                    }
                    <Sheet>
                        <SheetTrigger>
                            <div className="flex items-center text-sm cursor-pointer">
                                <span>Menu</span>
                                <div className="ml-2 ">
                                    <span className="block w-7 h-[2px] mb-[5px] bg-gray-900 rounded"></span>
                                    <span className="block w-3 h-[2px] bg-gray-900 rounded"></span>
                                </div>
                            </div>
                        </SheetTrigger>
                        <SheetContent>
                            <SideNavbar />
                        </SheetContent>
                    </Sheet>
                    {context.isAuthenticated ?
                        <>
                            <Link href="/dashboard">
                                <Button className={clsx('ml-5')}>
                                    Dashboard
                                </Button>
                            </Link>
                            <Button onClick={handleSignOut} className={clsx('ml-5', buttonVariants({ variant: "outline" }))}>
                                Signout
                            </Button>
                        </>
                        :
                        <>
                            <Link href="/login">
                                <Button variant="outline" className={clsx('ml-5')}>
                                    Login
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className={clsx('ml-5')}>
                                    Register
                                </Button>
                            </Link>
                        </>
                    }
                </div>
            </nav>
        </header>
    )
}

export default Navbar;
