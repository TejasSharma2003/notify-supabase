import * as z from "zod";

export const imageDeleteSchema = z.object({
  authorId: z.string(),
  coverImage: z.string(),
});

