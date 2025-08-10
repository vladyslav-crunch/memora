import SignUpForm from "@/components/auth/sign-up-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
    const session = await auth();
    if (session) redirect("/");
    return (
        <main className="max-w-sm mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Create your account</h1>
            <SignUpForm />
        </main>
    );
}
