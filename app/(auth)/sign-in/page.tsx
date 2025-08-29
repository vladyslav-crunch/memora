"use client";

import SignInForm from "@/components/auth/sign-in-form";
import AuthFormWrapper from "@/components/auth/auth-form-wrapper";

function SignInPage() {
    return (
        <AuthFormWrapper title={"Welcome back!"}>
            <SignInForm/>
        </AuthFormWrapper>
    );
}

export default SignInPage;