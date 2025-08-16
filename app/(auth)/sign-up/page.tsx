import SignUpForm from "@/components/auth/sign-up-form";

export default async function SignUpPage() {
    return (
        <div className={"w-full"}>
            <h1 className="text-[28px] font-semibold mb-4">Create your account</h1>
            <SignUpForm/>
        </div>
    );
}
