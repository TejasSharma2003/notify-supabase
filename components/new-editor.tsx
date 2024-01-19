'use client'

import React from 'react'
import createArticle from '@/actions/articles/create';
import TextareaAutosize from 'react-textarea-autosize'
import EditorJS from "@editorjs/editorjs"
import "@/styles/editor.css"
import { articlePatchSchema } from "@/lib/validations/article"

import { Icons } from "@/components/icons"
import { useForm } from 'react-hook-form';

import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Button, buttonVariants } from "@/components/ui/button"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Separator } from '@/components/ui/separator';
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 } from 'uuid'

import Uppy from "@uppy/core";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { DashboardModal } from "@uppy/react";
import Tus from "@uppy/tus";

import slugify from "react-slugify";

import { articleEditFormSchema } from '@/lib/validations/article';
import { toast } from './ui/use-toast';
import { useRouter } from 'next/navigation';
import EditorUploadCoverImageItem from './editor-upload-cover-image-item';
import { createBrowserClient } from '@/lib/supabase/client';
import { Textarea } from './ui/textarea';
import { Car, ChevronLeft, SparklesIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import EditorUploadCoverImagePlaceHolder from './ui/editor-upload-cover-image-placeholder';

type EditorFormValues = z.infer<typeof articleEditFormSchema>;

const NewEditor = ({ article }: { article: Article }) => {
    const ref = React.useRef<EditorJS | undefined>(undefined);
    const router = useRouter();
    const [showCoverModal, setShowCoverModal] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);
    const [showLoadingAlert, setShowLoadingAlert] = React.useState(false);
    const [isMounted, setIsMounted] = React.useState<boolean>(false)

    // Default values for the form
    const defaultValues: Partial<EditorFormValues> = {
        title: article.title || "Untitled",
        slug: article.slug || `post-${v4()}`,
        cover_image: article.cover_image || "",
        description: article.description || "",
        content: article.content || "",
    };

    const form = useForm<EditorFormValues>({
        resolver: zodResolver(articleEditFormSchema),
        defaultValues,
        mode: "onChange",
    });

    // Setup Uppy with Supabase
    const bucketNameCoverImage = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_COVER_IMAGE!;
    const token = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID!;
    const supabaseUploadURL = `https://${projectId}.supabase.co/storage/v1/upload/resumable`;

    // Uppy instance for cover photo upload
    const uppyCover = new Uppy({
        id: "cover-image",
        autoProceed: false,
        debug: false,
        allowMultipleUploadBatches: true,
        restrictions: {
            maxFileSize: 6000000,
            maxNumberOfFiles: 1,
        },
    }).use(Tus, {
        endpoint: supabaseUploadURL,
        headers: {
            authorization: `Bearer ${token}`,
        },
        chunkSize: 6 * 1024 * 1024,
        allowedMetaFields: [
            "bucketName",
            "objectName",
            "contentType",
            "cacheControl",
        ],
        onError: function(error) {
            console.log('Failed because: ' + error)
        },
    });

    uppyCover.on("file-added", (file) => {
        file.meta = {
            ...file.meta,
            bucketName: bucketNameCoverImage,
            objectName: `${article.user_id}/${article.id}-${file.name}`,
            contentType: file.type,
        };
    });

    uppyCover.on("complete", async (result) => {
        if (result.successful.length > 0) {

            // update article with cover_image column
            const uploadedImageName = result.successful[0].name;
            const supabase = createBrowserClient();
            const data = await supabase.from("articles").update({ cover_image: `${article.id}-${uploadedImageName}` }).eq("id", article.id);

            // TODO incase of error remove the uploaded image from the bucket.
            toast({
                description: "Cover image is uploaded"
            })
            router.refresh();
        } else {
            toast({
                description: "Cover image isn't uploaded"
            })
        }
        setShowCoverModal(false);
    });


    // Rich text  editor editorjs
    const initializeEditor = React.useCallback(async () => {
        const EditorJS = (await import("@editorjs/editorjs")).default
        const Header = (await import("@editorjs/header")).default
        const Embed = (await import("@editorjs/embed")).default
        const Table = (await import("@editorjs/table")).default
        const List = (await import("@editorjs/list")).default
        const Code = (await import("@editorjs/code")).default
        const LinkTool = (await import("@editorjs/link")).default
        const InlineCode = (await import("@editorjs/inline-code")).default

        const { content } = articlePatchSchema.parse(article);
        const body = JSON.parse(content);

        if (!ref.current) {
            const editor = new EditorJS({
                holder: "editor",
                onReady() {
                    ref.current = editor
                },
                placeholder: "Type here to write your content...",
                inlineToolbar: true,
                data: body,
                tools: {
                    header: Header,
                    linkTool: LinkTool,
                    list: List,
                    code: Code,
                    inlineCode: InlineCode,
                    table: Table,
                    embed: Embed,
                }
            })
        }
    }, [article])

    React.useEffect(() => {
        if (typeof window !== "undefined") {
            setIsMounted(true)
        }
    }, [])

    React.useEffect(() => {
        if (isMounted || ref.current === null) {
            initializeEditor()

            return () => {
                ref.current?.destroy()
                ref.current = undefined
            }
        }
    }, [isMounted, initializeEditor])


    const onSubmit = async (data: EditorFormValues) => {
        setShowLoadingAlert(true);
        setIsSaving(true);

        const blocks = await ref?.current?.save();
        const response = await createArticle({
            id: article.id,
            title: data.title,
            content: JSON.stringify(blocks),
            description: data.description,
            slug: data.slug
        })
        if (response) {
            toast({
                description: "You're article has been saved",
            })
            router.refresh();
        } else {
            toast({
                description: "Something went wrong while saving your article",
                variant: "destructive"
            })
        }
        setShowLoadingAlert(false);
        setIsSaving(false);


    }


    return (
        <>
            <Form {...form}>
                <div className='flex items-center space-x-8 fixed top-0 w-full mt-8'>
                    <Link
                        href="/dashboard"
                        className={cn(buttonVariants({ variant: "ghost" }))} >
                        <>
                            <Icons.chevronLeft className="mr-2 h-4 w-4" />
                            Back
                        </>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                        {article.is_published ? "Published" : "Draft"}
                    </p>
                </div>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                    {/* Cover Image */}
                    <Card className="max-w-2xl mx-auto">
                        <CardHeader>
                            <CardTitle>Cover Image</CardTitle>
                            <CardDescription>You can upload one cover image.</CardDescription>
                        </CardHeader>
                        <Separator className="mb-8" />
                        <CardContent className="space-y-4">
                            {/* Image */}
                            <FormField
                                control={form.control}
                                name="cover_image"
                                render={({ field }) => (
                                    <FormItem className="w-full max-w-xl">
                                        <FormControl>
                                            <Input
                                                placeholder="input placeholder"
                                                {...field}
                                                disabled={true}
                                                className="hidden bg-gray-50"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex w-full flex-col">
                                <DashboardModal
                                    uppy={uppyCover}
                                    open={showCoverModal}
                                    onRequestClose={() => setShowCoverModal(false)}
                                    disablePageScrollWhenModalOpen={false}
                                    showSelectedFiles
                                    showRemoveButtonAfterComplete
                                    note="Only JPG, PNG and GIF files are allowed"
                                    proudlyDisplayPoweredByUppy={false}
                                    showLinkToFileUploadResult
                                />
                                {article.cover_image === "" && (
                                    <div className="col-span-full">
                                        <div className="mb-1 flex items-center gap-x-3">
                                            <button
                                                onClick={() => setShowCoverModal(!showCoverModal)}
                                                type="button"
                                                className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                            >
                                                <span className="">
                                                    Upload image
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {article.cover_image !== "" ? (
                                    <EditorUploadCoverImageItem
                                        authorId={article.user_id}
                                        articleId={article.id}
                                        coverImage={article.cover_image}
                                    />
                                ) : (
                                    <EditorUploadCoverImagePlaceHolder />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className='max-w-2xl mx-auto'>
                        <CardHeader>
                            <CardTitle>
                                Rich text editor
                            </CardTitle>
                            <CardDescription>
                                Write your article <kbd className='rounded-md border bg-muted px-1 text-xs uppercase'>Tab</kbd> to open option
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className="prose !w-full !max-w-full prose-stone mx-auto dark:prose-invert border-black ">
                                {form.formState.errors.title?.message && <span className='text-red-500'>{form.formState.errors.title?.message}</span>}
                                <TextareaAutosize
                                    autoFocus
                                    id="title"
                                    defaultValue={article.title}
                                    placeholder="Article"
                                    className="w-full resize-none font-sans appearance-none overflow-hidden bg-transparent text-5xl font-black focus:outline-none"
                                    {...form.register("title")}
                                />
                                <div id="editor" className="min-h-[500px] " />

                            </div>
                        </CardContent>
                    </Card>

                    {/* Short Description */}
                    <Card className="max-w-2xl mx-auto">
                        <CardHeader>
                            <CardTitle>
                                General information
                            </CardTitle>
                            <CardDescription>
                                Update your  general information
                            </CardDescription>
                        </CardHeader>
                        <Separator className="mb-8" />
                        <CardContent className="space-y-4">
                            {/* Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Write a short description about your article"
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem className="w-full max-w-md">
                                        <FormLabel>Slug</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Give a slug for your post"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="mt-2"
                                                onClick={() =>
                                                    field.onChange(slugify(form.getValues("title")))
                                                }
                                            >
                                                <SparklesIcon className="mr-2 h-4 w-4" />
                                                Generate slug
                                            </Button>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </CardContent>
                    </Card>
                    <div className="infline-flex flex items-center justify-start space-x-3 max-w-2xl mx-auto">
                        <Button type="submit" disabled={isSaving}>Update</Button>
                        <Button
                            type="button"
                            onClick={() => router.back()}
                            variant="outline"
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                    </div>
                </form >
            </Form >
            <AlertDialog open={showLoadingAlert} onOpenChange={setShowLoadingAlert}>
                <AlertDialogContent className="font-sans">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center">
                            Please wait
                        </AlertDialogTitle>
                        <AlertDialogDescription className="mx-auto text-center">
                            <Icons.spinner className='h-6 w-6 animate-spin' />
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>

        </>
    )
}

export default NewEditor;
