import React from 'react';
import AuthCard, {AuthCardProps} from "@/components/ui/auth-cards/auth-card";
import styles from './auth-cards.module.css'

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

function AuthCards() {
    return (
        <div className={styles.authCardsContainer}>
            {authCards.map((card) => (
                <AuthCard key={card.front} card={card}/>
            ))}
        </div>
    );
}

export default AuthCards;