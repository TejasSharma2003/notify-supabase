"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import deleteArticle from "@/actions/articles/delete"
import publishArticle from "@/actions/articles/publish"

interface ArticleOperationsProps {
    article: {
        id: string,
        title: string
        is_published: boolean
    }
}


export function ArticleOperations({ article }: ArticleOperationsProps) {
    const router = useRouter()
    const [showPublishPopup, setShowPublishPopup] = React.useState<boolean>(false);
    const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);
    const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false);
    const [isPublishLoading, setIsPublishLoading] = React.useState<boolean>(false);
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
                    <Icons.ellipsis className="h-4 w-4" />
                    <span className="sr-only">Open</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        <Link href={`/editor/${article.id}`} className="flex w-full">
                            Edit
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="flex cursor-pointer items-center"
                        onSelect={() => setShowPublishPopup(true)}
                    >
                        {article.is_published ? "Unpublish" : "Publish"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="flex cursor-pointer items-center text-destructive focus:text-destructive"
                        onSelect={() => setShowDeleteAlert(true)}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete this article?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async (event) => {
                                event.preventDefault()
                                setIsDeleteLoading(true)

                                const deleted = await deleteArticle(article.id)

                                if (deleted) {
                                    setIsDeleteLoading(false)
                                    setShowDeleteAlert(false)
                                    router.refresh()
                                }
                            }}
                            className="bg-red-600 focus:ring-red-600"
                        >
                            {isDeleteLoading ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Icons.trash className="mr-2 h-4 w-4" />
                            )}
                            <span>Delete</span>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            {/* TODO instead of coping this make this more robust by utilizing delete popup */}
            <AlertDialog open={showPublishPopup} onOpenChange={setShowPublishPopup}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to Publish this article?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            You can later mark this article unpublished
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async (event) => {
                                event.preventDefault()
                                setIsPublishLoading(true)
                                const publised = await publishArticle(article.id)
                                if (publised) {
                                    setIsPublishLoading(false)
                                    setShowPublishPopup(false)
                                    router.refresh()
                                }
                            }}
                            className="bg-primary focus:ring-red-600"
                        >
                            {isPublishLoading ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Icons.trash className="mr-2 h-4 w-4" />
                            )}
                            {article.is_published ? <span>Unpublish</span> : <span>Publish</span>}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

