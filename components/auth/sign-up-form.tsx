"use client";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {signIn} from "next-auth/react";
import Input from "@/components/ui/input/input";
import Button, {BUTTON_COLOR, BUTTON_VARIANT} from "@/components/ui/button/button";
import {UserRound, Mail, Lock} from 'lucide-react'
import Link from "next/link";
import {SignUpInputsType, SignUpSchema} from "@/lib/validation/auth/auth-schemas";

export default function SignUpForm() {
    const router = useRouter();
    const [serverError, setServerError] = useState("");
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<SignUpInputsType>({resolver: zodResolver(SignUpSchema)});

    async function onSubmit(values: SignUpInputsType) {
        setServerError("");
        const res = await fetch("/api/auth/sign-up", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(values),
        });

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            setServerError(body.error ?? "Sign up failed");
            return;
        }

        const login = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        });

        if (login?.error) {
            router.push("/sign-in");
        } else {
            router.push("/");
        }
    }

    return (
        <div className={"w-full max-w-md"}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {serverError && <p className="text-red-600">{serverError}</p>}
                <div className="flex flex-col gap-3 w-full max-w-md">
                    <Input
                        type="text"
                        placeholder="Username"
                        {...register("name")}
                        icon={UserRound}
                        error={errors.name?.message}
                    />
                    <Input
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                        icon={Mail}
                        error={errors.email?.message}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                        icon={Lock}
                        error={errors.password?.message}
                    />
                    <Input
                        type="password"
                        placeholder="Repeat password"
                        {...register("confirmPassword")}
                        icon={Lock}
                        error={errors.confirmPassword?.message}
                    />
                </div>
                <Button
                    buttonType={BUTTON_VARIANT.base}
                    buttonColor={BUTTON_COLOR.orange}
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Creating..." : "Sign up"}
                </Button>
            </form>
            <div className="text-center text-m mt-3">
                Already have an account? <Link href="/sign-in" className="font-medium">Sign in</Link>
            </div>
        </div>
    );
}
