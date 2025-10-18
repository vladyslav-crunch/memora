import {z} from "zod";

export const EmailSchema = z
    .email("Invalid email address")
    .min(1, "Email is required").max(254, "Email must be 254 characters or less");
