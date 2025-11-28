import {z} from "zod";

export const ImportCardSchema = z.object({
    front: z.string().min(1, "Front text is required"),
    back: z.string().min(1, "Back text is required"),
    context: z.string().nullable().optional(),
});

export const ImportCardsSchema = z.object({
    deckId: z.number().int(),
    cards: z.array(ImportCardSchema).min(1, "At least one card is required"),
});

export type ImportCardsInput = z.infer<typeof ImportCardsSchema>;