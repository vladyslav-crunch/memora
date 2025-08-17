import React from 'react';
import styles from './deck.module.css';
import {DeckStatsItem} from "@/lib/types/api";

type DeckProps = {
    deck: DeckStatsItem;
}

function Deck({deck}: DeckProps) {
    return (
        <div className={styles.deckContainer}>
            <p className={styles.deckCount}>{deck.counts.totalCards} cards</p>
            <p className={styles.deckName}>{deck.name}</p>
            <span className={styles.deckRepeat}>{deck.counts.dueCards}</span>
        </div>
    );
}

export default Deck;