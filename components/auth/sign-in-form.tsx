"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SignInSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInValues = z.infer<typeof SignInSchema>;

export default function SignInForm() {
    const router = useRouter();
    const [serverError, setServerError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInValues>({
        resolver: zodResolver(SignInSchema),
    });

    async function onSubmit(data: SignInValues) {
        setServerError("");
        const res = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false, // important for handling errors here
        });

        if (res?.error) {
            setServerError("Invalid email or password");
        } else {
            router.push("/");
        }
    }

    function handleGoogleSignIn() {
        signIn("google", { redirectTo: "/" }); // v5 way
    }

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                {serverError && <p className="text-red-600">{serverError}</p>}

                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                        className="w-full border p-2 rounded"
                    />
                    {errors.email && (
                        <p className="text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                        className="w-full border p-2 rounded"
                    />
                    {errors.password && (
                        <p className="text-sm text-red-600">{errors.password.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
                >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
            </form>

            <div className="flex items-center gap-2">
                <hr className="flex-grow border-gray-300" />
                <span className="text-sm text-gray-500">OR</span>
                <hr className="flex-grow border-gray-300" />
            </div>

            <button
                onClick={handleGoogleSignIn}
                className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
                Continue with Google
            </button>
        </div>
    );
}
