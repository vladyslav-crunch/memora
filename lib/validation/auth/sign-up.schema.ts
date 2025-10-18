import {z} from "zod";
import {EmailSchema} from "@/lib/validation/user/fields/email.schema";
import {NameSchema} from "@/lib/validation/user/fields/name.schema";
import {PasswordSchema} from "@/lib/validation/user/fields/password.schema";

export const SignUpSchema = z
    .object({
        email: EmailSchema,
        name: NameSchema,
        password: PasswordSchema,
        confirmPassword: z.string().min(6, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

export type SignUpInputsType = z.infer<typeof SignUpSchema>;