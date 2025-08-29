"use client"
import React from 'react';
import AuthCard, {AuthCardProps} from "@/components/ui/auth-cards/auth-card";
import styles from './auth-cards.module.css';
import {motion, stagger, Variants} from "framer-motion";

const authCards: AuthCardProps[] = [
    {
        front: "ありがとう",
        back: "Thank you",
        context: "Expression of gratitude in Japan",
        color: "#D6BDFC",
        language: "jp"
    },
    {
        front: "Apfel",
        back: "Apple",
        context: "Round fruit from trees",
        color: "#FFB4A0",
        language: "de"
    },
    {
        front: "Bibliothèque",
        back: "Library",
        context: "Place with many books",
        color: "#FEF5E3",
        language: "fr"
    }
];

const containerVariants: Variants = {
    hidden: {opacity: 0},
    visible: {
        opacity: 1,
        transition: {
            delayChildren: stagger(0.3), // 👈 preferred way in v11+
        },
    },
};


function AuthCards() {
    return (
        <motion.div
            className={styles.authCardsWrapper}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {authCards.map((card, index) => (
                <AuthCard card={card} key={index}/>
            ))}
        </motion.div>
    );
}

export default AuthCards;
