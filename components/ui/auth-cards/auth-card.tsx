import React from "react";
import styles from "./auth-card.module.css";
import {motion, Variants} from "framer-motion";

export type AuthCardProps = {
    front: string;
    back: string;
    context: string;
    color: string;
    language: string;
};

export type AuthCardComponentProps = {
    card: AuthCardProps;
};
const cardVariants: Variants = {
    hidden: {opacity: 0, y: 30},
    visible: {
        opacity: 1,
        y: 0,
        transition: {duration: 0.5, ease: "easeOut" as const}
    },
};

function AuthCard({card}: AuthCardComponentProps) {
    return (
        <motion.div key={card.front} variants={cardVariants} className={styles.authCardContainer}
                    style={{backgroundColor: card.color}}>
            <span className={styles.langPill}>{card.language.toLowerCase()}</span>
            <div className={styles.front}>{card.front}</div>
            <div className={styles.back}>{card.back}</div>
            <div className={styles.context}>{card.context}</div>
        </motion.div>
    );
}

export default AuthCard;
