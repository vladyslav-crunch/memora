import {z} from "zod";
import {DeckFieldsSchema} from "@/lib/validation/deck/deck-fields.schema";

export const UpdateDeckSchema = DeckFieldsSchema
    .partial()
    .superRefine((val, ctx) => {
        const modes = ["isQuizNormal", "isQuizReversed", "isQuizTyping", "isQuizRandomized"];
        const hasModeField = modes.some((mode) => mode in val);

        if (hasModeField) {
            const hasAtLeastOneMode = val.isQuizNormal || val.isQuizReversed || val.isQuizTyping || val.isQuizRandomized;
            if (!hasAtLeastOneMode) {
                ctx.addIssue({
                    code: "custom",
                    message: "Select at least one mode",
                    path: ["modes"],
                });
            }
        }
    });

export type UpdateDeckInput = z.input<typeof UpdateDeckSchema>;
export type UpdateDeckValues = z.output<typeof UpdateDeckSchema>;
