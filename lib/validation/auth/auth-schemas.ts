import {z} from "zod";

export const SignInSchema = z.object({
    email: z.email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
});

export type SignInInputsType = z.infer<typeof SignInSchema>;

export const SignUpSchema = z
    .object({
        email: z.email("Invalid email address"),
        name: z.string().trim().min(1, "Username is required").max(60),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(6, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

export type SignUpInputsType = z.infer<typeof SignUpSchema>;