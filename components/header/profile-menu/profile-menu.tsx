"use client";

import React from "react";
import {signOut} from "next-auth/react";
import ClientProfileMenu from "@/components/header/client-profile-menu/client-profile-menu";

export default function ProfileMenu() {
    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return <ClientProfileMenu signOutAction={handleSignOut}/>;
}
