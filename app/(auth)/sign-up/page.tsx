import SignUpForm from "@/components/auth/auth-forms/sign-up-form";
import AuthFormWrapper from "@/components/auth/auth-forms/auth-form-wrapper";

export default async function SignUpPage() {
    return (
        <AuthFormWrapper title={"Create your account"}>
            <SignUpForm/>
        </AuthFormWrapper>
    );
}