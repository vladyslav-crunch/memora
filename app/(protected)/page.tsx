"use client";

import {auth} from "@/lib/auth";
import Report from "@/components/dashboard/report/report";
import SharedDecks from "@/components/dashboard/shared-decks/shared-decks";
import Decks from "@/components/dashboard/decks/decks";
import {useMediaQuery} from "usehooks-ts";
import styles from "./dashboard.module.css";

export default function Dashboard() {
    const isMobile = useMediaQuery("(max-width: 900px)");

    return (
        <div className={styles.container}>
            {isMobile ? (
                // mobile layout
                <div className={styles.mobile}>
                    <Report/>
                    <Decks/>
                    <SharedDecks/>
                </div>
            ) : (
                // desktop layout
                <div className={styles.desktop}>
                    <div className={styles.left}>
                        <Report/>
                        <SharedDecks/>
                    </div>
                    <div className={styles.right}>
                        <Decks/>
                    </div>
                </div>
            )}
        </div>
    );
}
