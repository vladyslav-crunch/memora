import SignInForm from "@/components/auth/sign-in-form";

async function SignInPage() {
    return (
        <div className="w-full">
            <h1 className="text-[28px] font-semibold mb-4">Welcome back!</h1>
            <SignInForm/>
        </div>
    );
}

export default SignInPage