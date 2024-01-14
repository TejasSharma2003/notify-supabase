"use client"

import * as React from "react"
import Link from "next/link"
import { redirect, useRouter } from "next/navigation"
import EditorJS from "@editorjs/editorjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import TextareaAutosize from "react-textarea-autosize"
import * as z from "zod"

import "@/styles/editor.css"
import { cn } from "@/lib/utils"
import { articlePatchSchema } from "@/lib/validations/article"
import { buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import createArticle from "@/actions/articles/create"
import { ArticleEditorProps } from "@/types/post"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { createBrowserClient } from "@/utils/supabase/client"
import { Car } from "lucide-react"

type FormData = z.infer<typeof articlePatchSchema>

type EditorProps = {
    article: ArticleEditorProps
}

export function Editor({ article }: EditorProps) {
    const { register, handleSubmit } = useForm<FormData>({
        resolver: zodResolver(articlePatchSchema)
    })

    const ref = React.useRef<EditorJS>()
    const router = useRouter()
    const [isSaving, setIsSaving] = React.useState<boolean>(false)
    const [isMounted, setIsMounted] = React.useState<boolean>(false)
    const [selectedImage, setSelectedImage] = React.useState<React.FormHTMLAttributes | null>(null);
    const [uploading, setUploading] = React.useState(false)
    const supabase = createBrowserClient();


    const initializeEditor = React.useCallback(async () => {
        const EditorJS = (await import("@editorjs/editorjs")).default
        const Header = (await import("@editorjs/header")).default
        const Embed = (await import("@editorjs/embed")).default
        const Table = (await import("@editorjs/table")).default
        const List = (await import("@editorjs/list")).default
        const Code = (await import("@editorjs/code")).default
        const LinkTool = (await import("@editorjs/link")).default
        const InlineCode = (await import("@editorjs/inline-code")).default

        const body = articlePatchSchema.parse(article)

        if (!ref.current) {
            const editor = new EditorJS({
                holder: "editor",
                onReady() {
                    ref.current = editor
                },
                placeholder: "Type here to write your post...",
                inlineToolbar: true,
                data: body.content,
                tools: {
                    header: Header,
                    linkTool: LinkTool,
                    list: List,
                    code: Code,
                    inlineCode: InlineCode,
                    table: Table,
                    embed: Embed,
                },
            })
        }
    }, [article])

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            setIsMounted(true)
        }
    }, [])

    React.useEffect(() => {
        if (isMounted) {
            initializeEditor()

            return () => {
                ref.current?.destroy()
                ref.current = undefined
            }
        }
    }, [isMounted, initializeEditor])

    const onUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return;
        }
        setSelectedImage(event.target?.files[0]);
    }

    async function onSubmit(data: FormData) {
        if (!selectedImage) {
            return toast({
                description: "You also need to select a cover Imager"
            })
        }
        const blocks = await ref.current?.save();
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) return;

        // if image contains ext in the name remove that;
        const fileName = selectedImage.name.split('.')[0];
        const fileExt = selectedImage.name.split('.').pop();
        const filePath = `${session?.user.id}/${article.id}-${fileName}.${fileExt}`

        let { error: uploadError } = await supabase.storage.from('cover-image').upload(filePath, selectedImage)
        if (uploadError) {
            return toast({
                description: "Failed to upload cover image"
            })
        }

        const cover_image = `${article.id}-${fileName}.${fileExt}`;
        const res = await createArticle({
            id: article.id,
            title: data.title || "untitled",
            cover_image: cover_image,
            content: JSON.stringify(blocks)
        });

        if (res) {
            router.push("/dashboard");
            return toast({
                description: "You article is saved"
            })
        }
        toast({
            description: "Something went wrong while saving your article",
            variant: "destructive"
        })
    }

    if (!isMounted) {
        return null
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid w-full gap-10">
                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center space-x-10">
                            <Link
                                href="/dashboard"
                                className={cn(buttonVariants({ variant: "ghost" }))}>
                                <>
                                    <Icons.chevronLeft className="mr-2 h-4 w-4" />
                                    Back
                                </>
                            </Link>
                            <p className="text-sm text-muted-foreground">
                                {article.is_published ? "Published" : "Draft"}
                            </p>
                        </div>
                        <button type="submit" className={cn(buttonVariants())}>
                            {isSaving && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            <span>Update</span>
                        </button>
                    </div>
                    <div>
                        <h1>Upload and Display Image usign React Hook's</h1>
                        {selectedImage && (
                            <div>
                                <img
                                    alt="not found"
                                    width={"250px"}
                                    src={URL.createObjectURL(selectedImage)}
                                />
                                <br />
                                <button onClick={() => setSelectedImage(null)}>Remove</button>
                            </div>
                        )}
                        <br />
                        <br />
                        <input
                            type="file"
                            name="myImage"
                            id="cover_image"
                            onChange={onUploadImage}
                        />
                    </div>


                    {/* Description for the article */}

                    <Card>
                        <CardHeader>
                            <CardTitle>Descrition</CardTitle>
                            <CardDescription>Give your article a meaning full description</CardDescription>
                            <CardContent>
                            </CardContent>
                        </CardHeader>
                    </Card>
                    <div className="prose prose-stone mx-auto dark:prose-invert">
                        <TextareaAutosize
                            autoFocus
                            id="title"
                            defaultValue={article.title}
                            placeholder="Article title"
                            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
                            {...register("title")}
                        />

                        <div id="editor" className="min-h-[500px]" />
                        <p className="text-sm text-gray-500">
                            Use{" "}
                            <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
                                Tab
                            </kbd>{" "}
                            to open the command menu.
                        </p>
                    </div>
                </div>
            </form>
        </>
    )
}


