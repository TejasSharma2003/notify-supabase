'use client'
import Logo from "./logo";
import React from "react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import SearchBox from "@/components/search-box";
import SideNavbar from "./side-navbar";
import { createBrowserClient } from "@/utils/supabase/client";
import { toast } from "./ui/use-toast";
import { Button, buttonVariants } from "./ui/button";
import { SheetTrigger, Sheet, SheetContent } from "./ui/sheet";
import { SearchIcon } from "lucide-react";

const Navbar = ({ token }: { token: string }) => {
    const [show, setShow] = React.useState(true);
    const [lastScrollY, setLastScrollY] = React.useState(0);
    const supabase = createBrowserClient();
    const router = useRouter();

    const controlNavbar = () => {
        if (window.scrollY > lastScrollY) { // if scroll down hide the navbar
            setShow(false);
        } else { // if scroll up show the navbar
            setShow(true);
        }

        // remember current page location to use in the next move
        setLastScrollY(window.scrollY);
    };

    React.useEffect(() => {
        window.addEventListener('scroll', controlNavbar);

        // cleanup function
        return () => {
            window.removeEventListener('scroll', controlNavbar);
        };
    }, [lastScrollY]);

    const handleSignOut = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { error } = await supabase.auth.signOut();
        if (error) {
            return toast({
                description: "Something went wrong while signing out",
                variant: "destructive"
            })
        }
        toast({
            description: "Signout Successfully",
            variant: "default"
        })
        router.refresh();
    }

    return (
        <div className={clsx(`fixed h-20 top-0 z-20 w-full bg-white border-b border-b-border transition-transform duration-300`, {
            '-translate-y-full': !show,
        })}>
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
                    {/* <Button className={clsx(buttonVariants({ variant: "outline" }), ' mr-7')}> */}
                    {/*     Suscribe to newsletter */}
                    {/* </Button> */}
                    <Dialog>
                        <DialogTrigger>
                            <span className="cursor-pointer">
                                <SearchIcon width={20} />
                            </span>
                        </DialogTrigger>
                        <DialogContent>
                            <SearchBox />
                        </DialogContent>
                    </Dialog>
                    <div className="w-[1px] h-5 mx-5 bg-gray-400"></div>
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
                    {token === "" ?
                        <Link href="/login">
                            <Button className={clsx('ml-5')}>
                                Login
                            </Button>
                        </Link>
                        :
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
                    }
                </div>
            </nav>
        </div>
    )
}

export default Navbar;
