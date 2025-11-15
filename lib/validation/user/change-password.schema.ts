import {z} from "zod";
import {PasswordSchema} from "@/lib/validation/user/fields/password.schema";

//FRONTEND schema

export const ChangePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: PasswordSchema,
        confirmPassword: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type ChangePasswordValues = z.infer<typeof ChangePasswordSchema>;

//BACKEND schema

export const ChangePasswordServerSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required").optional(),
    newPassword: PasswordSchema,
});

