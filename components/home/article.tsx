import Link from "next/link";
import Image from "next/image"
import { Heart } from 'lucide-react';

const SingleArticle = () => {
    return (
        <article className="font-sans max-w-[637px]">
            <div className="flex align-top">
                <div className="relative">
                    <span className="text-sm text-gray-500">August 21, 2023</span>
                    <h3 className="mt-3 text-2xl font-semibold leading-7">Putin’s humilation means new danger to Russia - and to the world.</h3>
                    <Link href="/news/something-new" className="absolute inset-0">
                        <span className="sr-only">View Article</span>
                    </Link>
                </div>
                <div className="ml-3 overflow-hidden rounded ">
                    <Image
                        src="/putin.jpg"
                        className="hover:scale-110 transition-transform"
                        alt="putin-fight"
                        width={500}
                        height={500}
                    />

                </div>
            </div>
            <div className="flex">
                <div className="w-1 rounded bg-primary"></div>
                <div className="ml-2">
                    <span className="text-sm">Description</span>
                    <p className="text-base text-gray-700">Remote work evolves with AI tools improving collaboration. Traditional industries, from agriculture to manufacturing, benefit from AI
                        efficiencies.</p>
                </div>
            </div>
            <div className="relative text-end">
                <span className="text-sm font-semibold underline underline-offset-4">Read more</span>
                <Link href="/news/something-new" className="absolute inset-0">
                    <span className="sr-only">View Article</span>
                </Link>
            </div>
            <div className="flex justify-between mt-3">
                <span className="text-gray-500">300+ reads</span>
                <div className="flex text-sm">
                    <span className="flex items-center">
                        <Heart className="stroke-red-500" width={20} />
                        <span className="ml-1">3400</span>
                    </span>
                    <span className="ml-3 flex items-center">
                        <img src="/whatsapp.png" className="w-[23px] h-[23px]" />
                        <span className="ml-1">400</span>
                    </span>
                </div>
            </div>
        </article>
    )
}

const Article = () => {
    return (
        <div className="grid gap-14">
            <SingleArticle />
            <SingleArticle />
            <SingleArticle />
            <SingleArticle />
            <SingleArticle />
        </div>
    )
}
export default Article
