"use client";
import {Lock, Mail} from "lucide-react";
import {signIn} from "next-auth/react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {useRouter} from "next/navigation";
import Input from "@/components/ui/input/input";
import Button, {BUTTON_COLOR, BUTTON_VARIANT} from "@/components/ui/button/button";
import {SignInInputsType, SignInSchema} from "@/lib/validation/auth/auth-schemas";
import Link from "next/link";


export default function SignInForm() {
    const router = useRouter();
    const [serverError, setServerError] = useState("");
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<SignInInputsType>({
        resolver: zodResolver(SignInSchema),
    });

    async function onSubmit(data: SignInInputsType) {
        setServerError("");
        const res = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
        });
        if (res?.error) {
            setServerError("Invalid email or password");
        } else {
            router.push("/");
        }
    }

    function handleGoogleSignIn() {
        signIn("google", {redirectTo: "/"});
    }

    return (
        <div className={"w-full max-w-md"}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {serverError && <p style={{color: "#E53935"}}>{serverError}</p>}
                <div className="flex flex-col gap-3 ">
                    <Input
                        type="email"
                        placeholder="Email"
                        {...register("email")}
                        error={errors.email?.message}
                        icon={Mail}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                        error={errors.password?.message}
                        icon={Lock}
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <Button
                        buttonType={BUTTON_VARIANT.base}
                        buttonColor={BUTTON_COLOR.orange}
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Signing in..." : "Sign in"}
                    </Button>

                    <Button
                        type="button"
                        buttonType={BUTTON_VARIANT.base}
                        buttonColor={BUTTON_COLOR.google}
                        onClick={handleGoogleSignIn}
                    >
                        Google
                    </Button>
                </div>
            </form>
            <div className="text-center text-m mt-3">
                Don&apos;t have an account? <Link href="/sign-up" className="font-medium">Sign up</Link>
            </div>
        </div>
    );
}
