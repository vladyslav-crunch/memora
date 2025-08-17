import {z} from "zod";

export const CreateDeckSchema = z.object({
    name: z.string().min(1).max(200),
    isQuizNormal: z.boolean().optional().default(true),
    isQuizReversed: z.boolean().optional().default(false),
    isQuizTyping: z.boolean().optional().default(false),
    isQuizRandomized: z.boolean().optional().default(false),
    isPrivate: z.boolean().optional().default(false),
});