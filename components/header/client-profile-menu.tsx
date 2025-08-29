"use client";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import styles from "./client-profile-menu.module.css";
import {LogOut, UserRound, Settings} from "lucide-react";

type Props = {
    userImage: string;
    userName: string;
    signOutAction: () => Promise<void>;
};

export default function ClientProfileMenu({userImage, userName, signOutAction}: Props) {
    const [open, setOpen] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on click outside
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
                <Image
                    src={userImage}
                    alt={`${userName} avatar`}
                    width={75}
                    height={75}
                    priority
                    className={styles.ProfileMenuImage}
                />
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

                    <Link href="/settings" role="menuitem" className={styles.item} onClick={() => setOpen(false)}>
                        <Settings strokeWidth={1.2}/> Settings
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
