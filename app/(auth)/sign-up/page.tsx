import SignUpForm from "@/components/auth/sign-up-form";
import AuthFormWrapper from "@/components/auth/auth-form-wrapper";

export default async function SignUpPage() {
    return (
        <AuthFormWrapper title={"Create your account"}>
            <SignUpForm/>
        </AuthFormWrapper>
    );
}