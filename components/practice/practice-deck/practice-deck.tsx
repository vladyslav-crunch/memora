import React from "react";
import styles from './practice-deck.module.css'

function PracticeDeck({deckName}: { deckName: string }) {
    return (
        <div className={styles.practiceDeckContainer}>
            <h2>{deckName}</h2>
        </div>
    );
}

export default PracticeDeck;
