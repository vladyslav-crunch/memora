"use client";

import styles from "./header.module.css";
import Logo from "@/components/header/logo/logo";
import SearchBar from "@/components/header/search-bar/search-bar";
import Link from "next/link";
import PracticeButton from "@/components/header/practice-button/practice-button";
import {useMediaQuery} from "usehooks-ts";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";
import ClientProfileMenu from "@/components/header/client-profile-menu/client-profile-menu";

type HeaderMode = "auth" | "dashboard" | "learning";

type HeaderProps = {
    mode?: HeaderMode;
};

export default function Header({mode}: HeaderProps) {
    const [mounted, setMounted] = useState(false);
    const isMobile = useMediaQuery("(max-width: 900px)");
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <></>
        )
    }


    return (
        <header className={styles.headerContainer}>
            {isMobile ? (
                <div className={styles.headerMobile}>
                    {mode !== "auth" && (
                        <>
                            <Link href="/">
                                <Logo/>
                            </Link>
                            {pathname === "/" && <PracticeButton/>}
                            <SearchBar/>
                            <ClientProfileMenu/>
                        </>
                    )}
                </div>
            ) : (
                <>
                    <div className={styles.headerLeftSide}>
                        <Link href="/">
                            <Logo/>
                        </Link>
                    </div>
                    {mode !== "auth" && (
                        <div className={styles.headerRightSide}>
                            <PracticeButton/>
                            <SearchBar/>
                            <ClientProfileMenu/>
                        </div>
                    )}
                </>
            )}
        </header>
    );
}
