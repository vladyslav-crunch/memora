import {z} from "zod";

export const CreateDeckSchema = z.object({
    name: z.string().min(1, "Deck name must be at least 1 character").max(200).default(""),
    isQuizNormal: z.coerce.boolean().default(true),
    isQuizReversed: z.coerce.boolean().default(false),
    isQuizTyping: z.coerce.boolean().default(false),
    isQuizRandomized: z.coerce.boolean().default(false),
    isPrivate: z.coerce.boolean().default(false),
}).superRefine((val, ctx) => {
    const count =
        (val.isQuizNormal ? 1 : 0) +
        (val.isQuizReversed ? 1 : 0) +
        (val.isQuizTyping ? 1 : 0) +
        (val.isQuizRandomized ? 1 : 0);
    if (count < 1) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Select at least one mode",
            path: ["modes"],
        });
    }
});


export const UpdateDeckSchema = z
    .object({
        name: z.string().min(1, "Deck name must be at least 1 character").max(200).optional(),
        isQuizNormal: z.coerce.boolean().optional(),
        isQuizReversed: z.coerce.boolean().optional(),
        isQuizTyping: z.coerce.boolean().optional(),
        isQuizRandomized: z.coerce.boolean().optional(),
        isPrivate: z.coerce.boolean().optional(),
    })
    .superRefine((val, ctx) => {
        const modes = ["isQuizNormal", "isQuizReversed", "isQuizTyping", "isQuizRandomized"];
        const hasModeField = modes.some((mode) => mode in val);

        if (hasModeField) {
            const count =
                (val.isQuizNormal ? 1 : 0) +
                (val.isQuizReversed ? 1 : 0) +
                (val.isQuizTyping ? 1 : 0) +
                (val.isQuizRandomized ? 1 : 0);

            if (count < 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Select at least one mode",
                    path: ["modes"],
                });
            }
        }
    });


export type UpdateDeckInput = z.input<typeof UpdateDeckSchema>;
export type UpdateDeckValues = z.output<typeof UpdateDeckSchema>;


export type CreateDeckInput = z.input<typeof CreateDeckSchema>;   // resolver INPUT
export type CreateDeckValues = z.output<typeof CreateDeckSchema>;  // resolver OUTPUT (what your API expects)
