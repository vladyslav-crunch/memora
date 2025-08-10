"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const schema = z.object({
    name: z.string().trim().max(60).optional().or(z.literal("")),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type Values = z.infer<typeof schema>;

export default function SignUpForm() {
    const router = useRouter();
    const [serverError, setServerError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<Values>({ resolver: zodResolver(schema) });

    async function onSubmit(values: Values) {
        setServerError("");
        const res = await fetch("/api/auth/sign-up", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            setServerError(body.error ?? "Sign up failed");
            return;
        }

        // ✅ Option A: auto sign-in after creating the account
        const login = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        });
        if (login?.error) {
            // Should be rare; fallback to sign-in page
            router.push("/sign-in");
        } else {
            router.push("/");
        }

        // ✅ Option B (instead): comment the block above and do:
        // router.push("/sign-in");
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {serverError && <p className="text-red-600">{serverError}</p>}

            <div>
                <input
                    type="text"
                    placeholder="Name (optional)"
                    {...register("name")}
                    className="w-full border p-2 rounded"
                />
                {errors.name && (
                    <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
            </div>

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
                {isSubmitting ? "Creating..." : "Create account"}
            </button>

            <div className="text-sm">
                Already have an account? <a href="/sign-in" className="underline">Sign in</a>
            </div>
        </form>
    );
}
