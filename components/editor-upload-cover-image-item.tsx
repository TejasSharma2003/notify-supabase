import { deleteCoverImage } from "@/actions/images/delete-cover-image";
import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { protectedEditorConfig } from "@/config/protected";
import { shimmer, toBase64 } from "@/lib/utils";
import { Loader2 as SpinnerIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface EditorUploadCoverImageItemProps {
    authorId: string;
    articleId: string;
    coverImage: string;
}

const EditorUploadCoverImageItem: FC<EditorUploadCoverImageItemProps> = ({
    authorId,
    coverImage,
    articleId
}) => {
    const router = useRouter();
    const [isDeleteLoading, setIsDeleteLoading] = React.useState(false);

    async function deleteImage() {
        setIsDeleteLoading(!isDeleteLoading);
        const imageData = {
            authorId: authorId,
            coverImage: coverImage,
            articleId: articleId
        };
        const response = await deleteCoverImage(imageData);
        if (response) {
            setIsDeleteLoading(false);
            router.refresh();
        } else {
            setIsDeleteLoading(false);
            console.log("An error while deleting cover image");
        }
    }
    const imageUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_COVER_IMAGE}/${authorId}/${coverImage}`
    return (
        <div className="col-span-full max-w-2xl">
            <Image
                src={imageUrl || "./image-not-found.jpg"}
                className="mb-5 rounded-lg shadow-sm"
                alt="Cover image"
                height={337}
                width={600}
                priority
                placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(600, 337))}`}
            />
            <div className="flex items-center gap-x-5">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                            <TrashIcon className="mr-2 h-4 w-4" />
                            {protectedEditorConfig.deleteImage}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader className="font-sans">
                            <AlertDialogTitle>
                                {protectedEditorConfig.deleteImageQuestion}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {protectedEditorConfig.deleteImageDescription}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="font-sans">
                            <AlertDialogCancel>
                                {protectedEditorConfig.cancel}
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={deleteImage}>
                                {isDeleteLoading ? (
                                    <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <TrashIcon className="mr-2 h-4 w-4" />
                                )}
                                <span>{protectedEditorConfig.cofirm}</span>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
};

export default EditorUploadCoverImageItem;

