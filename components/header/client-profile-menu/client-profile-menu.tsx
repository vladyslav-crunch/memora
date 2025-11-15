"use client";
import Link from "next/link";
import React, {useEffect, useRef, useState} from "react";
import styles from "./client-profile-menu.module.css";
import {LogOut, UserRound} from "lucide-react";
import {useUser} from "@/hooks/useUser";
import {CldImage} from "next-cloudinary";

type Props = {
    signOutAction: () => Promise<void>;
};

export default function ClientProfileMenu({signOutAction}: Props) {
    const [open, setOpen] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const {user} = useUser();
    const avatarPlaceHolder = "/avatar-placeholder.png"
    const [imageUrl, setImageUrl] = useState(avatarPlaceHolder);

    useEffect(() => {
        if (user) {
            setImageUrl(user.image || avatarPlaceHolder);
        }
    }, [user]);


    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!open) return;
            const t = e.target as Node;
            if (menuRef.current && !menuRef.current.contains(t) && btnRef.current && !btnRef.current.contains(t)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [open]);

    // Close on Escape
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }

        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    return (
        <div className={styles.wrapper}>
            <button
                ref={btnRef}
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Open user menu"
                onClick={() => setOpen((v) => !v)}
                className={styles.trigger}
            >
                {imageUrl && (
                    imageUrl.includes("res.cloudinary.com") ? (
                        <CldImage
                            src={imageUrl}
                            width="75"
                            height="75"
                            crop="fill"
                            alt="Profile Picture"
                            priority
                            className={styles.profileMenuImage}
                        />
                    ) : (
                        <img
                            src={imageUrl}
                            width={75}
                            height={75}
                            alt="Profile Picture"
                            className={styles.profileMenuImage}
                        />
                    )
                )}
            </button>

            {open && (
                <div
                    ref={menuRef}
                    role="menu"
                    aria-label="User menu"
                    className={styles.menu}
                >

                    <Link href="/profile" role="menuitem" className={styles.item} onClick={() => setOpen(false)}>
                        <UserRound strokeWidth={1.2}/> Profile
                    </Link>


                    <form action={signOutAction}>
                        <button type="submit" role="menuitem" className={styles.item}>
                            <LogOut strokeWidth={1.2}/> Log out
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
