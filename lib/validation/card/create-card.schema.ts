import {z} from "zod";
import {CardFieldsSchema} from "@/lib/validation/card/card-fields.schema";


export const CreateCardSchema = CardFieldsSchema.extend({
    deckId: z.number().int(),
});

export type CreateCardValues = z.infer<typeof CreateCardSchema>;