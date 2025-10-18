import {z} from "zod";

export const PasswordSchema = z
    .string()
    .min(6, "New password must be at least 6 characters long")
    .max(100, "Password too long");