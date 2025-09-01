import React, {useState} from 'react';
import styles from './deck.module.css';
import {DeckStatsItem} from "@/lib/types/api";
import DeckMenuModal from "@/components/dashboard/decks/modals/deck-menu-modal";

type DeckProps = {
    deck: DeckStatsItem;
}

function Deck({deck}: DeckProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <>
            <div className={styles.deckContainer} onClick={() => setIsModalOpen(true)}>
                <p className={styles.deckCount}>{deck.counts.totalCards} cards</p>
                <p className={styles.deckName}>{deck.name}</p>
                <span className={styles.deckRepeat}>{deck.counts.dueCards}</span>
            </div>
            <DeckMenuModal open={isModalOpen} onOpenChange={() => setIsModalOpen(false)} deck={deck}/>
        </>
    );
}

export default Deck;