"use client";

import {useState, useEffect} from "react";
import Report from "@/components/dashboard/report/report";
import LastSharedDecks from "@/components/dashboard/shared-decks/last-shared-decks";
import Decks from "@/components/dashboard/decks/decks";
import {useMediaQuery} from "usehooks-ts";
import styles from "./dashboard.module.css";

export default function Dashboard() {
    const isMobile = useMediaQuery("(max-width: 900px)");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // wait until client

    return (
        <div className={styles.container}>
            {isMobile ? (
                <div className={styles.mobile}>
                    <Report/>
                    <Decks/>
                    <LastSharedDecks/>
                </div>
            ) : (
                <div className={styles.desktop}>
                    <div className={styles.left}>
                        <Report/>
                        <LastSharedDecks/>
                    </div>
                    <div className={styles.right}>
                        <Decks/>
                    </div>
                </div>
            )}
        </div>
    );
}
