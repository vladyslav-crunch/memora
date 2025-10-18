import {z} from "zod";

export const NameSchema = z
    .string()
    .trim()
    .min(1, "Username is required")
    .max(30, "Username must be 30 characters or less");