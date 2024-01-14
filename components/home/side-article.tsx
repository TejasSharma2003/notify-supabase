import { delay } from "@/lib/utils"
import { Heart } from "lucide-react"
import Image from "next/image"

const SingleSideArticle = () => {
    return (
        <article className="font-sans max-w-[637px]">
            <div className="flex align-top flex-row-reverse">
                <div className="ml-5">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">300+ reads</span>
                        <div className="flex ">
                            <span className="flex items-center">
                                <Heart className="stroke-red-500" width={18} />
                                <span className="ml-1">3400</span>
                            </span>
                            <span className="ml-3 flex items-center ">
                                <img src="/whatsapp.png" className="w-[20px] h-[20px]" />
                                <span className="ml-1">400</span>
                            </span>
                        </div>
                    </div>
                    <h3 className="my-2 text-base leading-6">6-Year-Old Horse Dies at Belmont Park After Race Injury</h3>
                    <p className="text-gray-700 text-sm">NEW YORK—A 6-year-old horse died after being injured in a race at Belmont Park ahead of next week’s</p>
                </div>
                <div className="rounded overflow-hidden">
                    <Image
                        src="/putin.jpg"
                        className="hover:scale-110 transition-transform h-full w-full"
                        alt="putin-fight"
                        width={500}
                        height={500}
                    />

                </div>
            </div>
        </article>
    )

}

const SideArticle = async () => {
    await delay(3400);

    return (
        <div className="sticky top-0 self-start">
            <h1 className="font-heading text-2xl mb-8">Trending news here</h1>
            <div className="grid gap-10">
                <SingleSideArticle />
                <SingleSideArticle />
                <SingleSideArticle />
                <SingleSideArticle />
            </div>
        </div>
    )
}
export default SideArticle;
