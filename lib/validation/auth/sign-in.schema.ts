import {z} from "zod";
import {EmailSchema} from "@/lib/validation/user/fields/email.schema";

export const SignInSchema = z.object({
    email: EmailSchema,
    password: z.string().min(1, "Password is required"),
});

export type SignInInputsType = z.infer<typeof SignInSchema>;

