"use client";

import SignInForm from "@/components/auth/auth-forms/sign-in-form";
import AuthFormWrapper from "@/components/auth/auth-forms/auth-form-wrapper";

function SignInPage() {
    return (
        <AuthFormWrapper title={"Welcome back!"}>
            <SignInForm/>
        </AuthFormWrapper>
    );
}

export default SignInPage;