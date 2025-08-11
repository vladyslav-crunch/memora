import React from "react";
import styles from "./auth-card.module.css";

export type AuthCardProps = {
    front: string;
    back: string;
    context: string;
    color: string;     // card background (e.g. #cdb3ff)
    language: string;  // e.g. "jp"
};

export type AuthCardComponentProps = {
    card: AuthCardProps;
};

function AuthCard({card}: AuthCardComponentProps) {
    return (
        <div
            className={styles.authCardContainer}
            style={{backgroundColor: card.color}}
        >
            <span className={styles.langPill}>{card.language.toLowerCase()}</span>

            <div className={styles.front}>{card.front}</div>
            <div className={styles.back}>{card.back}</div>
            <div className={styles.context}>{card.context}</div>
        </div>
    );
}

export default AuthCard;
