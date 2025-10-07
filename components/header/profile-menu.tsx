import React from "react";
import {signOut} from "@/lib/auth";
import ClientProfileMenu from "@/components/header/client-profile-menu";

export default async function ProfileMenu() {
    const signOutAction = async () => {
        "use server";
        await signOut();
    };

    return (
        <ClientProfileMenu
            signOutAction={signOutAction}
        />
    );
}
