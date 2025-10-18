import {z} from "zod";
import {CardFieldsSchema} from "@/lib/validation/card/card-fields.schema";


export const ImportCardsSchema = z.object({
    deckId: z.coerce.number().int(),
    cards: z.array(CardFieldsSchema).nonempty(),
});

export type ImportCardsValues = z.infer<typeof ImportCardsSchema>;
