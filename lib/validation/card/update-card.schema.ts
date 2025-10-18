import {z} from "zod";
import {CardFieldsSchema} from "@/lib/validation/card/card-fields.schema";


export const UpdateCardSchema = CardFieldsSchema
    .partial()
    .extend({
        deckId: z.number().int().optional(),
    });

export type UpdateCardValues = z.infer<typeof UpdateCardSchema>;