import {DeckFieldsSchema} from "@/lib/validation/deck/deck-fields.schema";
import {z} from "zod";

export const CreateDeckSchema = DeckFieldsSchema
    .extend({})
    .superRefine((val, ctx) => {
        const hasAtLeastOneMode = val.isQuizNormal || val.isQuizReversed || val.isQuizTyping || val.isQuizRandomized;
        if (!hasAtLeastOneMode) {
            ctx.addIssue({
                code: "custom",
                message: "Select at least one mode",
                path: ["modes"],
            });
        }
    });

export type CreateDeckInput = z.input<typeof CreateDeckSchema>;
export type CreateDeckValues = z.output<typeof CreateDeckSchema>;