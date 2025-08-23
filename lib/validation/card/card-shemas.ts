import {z} from "zod";

export const CreateCardSchema = z.object({
    deckId: z.number().int(),
    front: z.string().min(1, "Front side must be at least 1 character").transform((s) => s.trim()),
    back: z.string().min(1, "Back side must be at least 1 character").transform((s) => s.trim()),
    context: z.string().nullable().transform((s) => (s && s.trim() !== "" ? s.trim() : null)),
    intervalStrength: z.number().min(0).max(1).optional().nullable(),
});

export type CreateCardValues = z.infer<typeof CreateCardSchema>;
