import React from "react";
import {auth, signOut} from "@/lib/auth";
import ClientProfileMenu from "@/components/header/client-profile-menu";


export default async function ProfileMenu() {
    const session = await auth();
    const userImage = session?.user?.image || "/avatar-placeholder.png";
    const userName = session?.user?.name || "User";

    const signOutAction = async () => {
        "use server";
        await signOut();
    };

    return (
        <ClientProfileMenu
            userImage={userImage}
            userName={userName}
            signOutAction={signOutAction}
        />
    );
}
