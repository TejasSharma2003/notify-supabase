import * as z from "zod"

// const MAX_FILE_SIZE = 5000000;
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const articlePatchSchema = z.object({
    content: z.any().optional(),
})


export const articleEditFormSchema = z.object({
    title: z
        .string()
        .min(2, {
            message: "Title must be at least 2 characters.",
        })
        .max(120, {
            message: "Title must not be longer than 120 characters.",
        }),
    slug: z
        .string()
        .min(2, {
            message: "Slug must be at least 2 characters.",
        })
        .max(100, {
            message: "Slug must not be longer than 100 characters.",
        }),
    cover_image: z.string(),
    description: z
        .string()
        .min(2, {
            message: "Description must be at least 2 characters.",
        })
        .max(300, {
            message: "Description must not be longer than 300 characters.",
        }),
    content: z.any()
});

