import {z} from "zod";


export const DeckFieldsSchema = z.object({
    name: z
        .string()
        .min(1, "Deck name must be at least 1 character")
        .max(200)
        .transform((s) => s.trim()).default(""),
    isQuizNormal: z.coerce.boolean().default(true),
    isQuizReversed: z.coerce.boolean().default(false),
    isQuizTyping: z.coerce.boolean().default(false),
    isQuizRandomized: z.coerce.boolean().default(true),
    isPrivate: z.coerce.boolean().default(true),
});
