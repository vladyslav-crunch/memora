import SignInForm from "@/components/auth/sign-in-form";
async function SignInPage() {
    return (
        <main className="max-w-sm mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
            <SignInForm />
        </main>
    );
}
export default SignInPage