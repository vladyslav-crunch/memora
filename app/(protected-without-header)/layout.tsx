import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";
import React from "react";

export default async function ProtectedWithoutHeaderLayout({children}: { children: React.ReactNode }) {
    const session = await auth();
    if (!session?.user) {
        redirect(`/sign-in`);
    }
    return (
        <>
            {children}
        </>
    )
}