import React, {useEffect, useState} from 'react';
import styles from './deck.module.css';
import {DeckStatsItem} from "@/lib/types/api";
import DeckMenuModal from "@/components/dashboard/decks/modals/deck-menu-modal";
import {formatNextRepetition} from "@/lib/utility/formatNextRepetition";

type DeckProps = {
    deck: DeckStatsItem;
}

function Deck({deck}: DeckProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [review, setReview] = useState(
        formatNextRepetition(deck.nextRepetition, deck.counts.dueCards)
    );

    useEffect(() => {
        const update = () => {
            setReview(formatNextRepetition(deck.nextRepetition, deck.counts.dueCards));
        };

        update();
        const interval = setInterval(update, 60_000); // 1 min
        return () => clearInterval(interval);
    }, [deck.nextRepetition, deck.counts.dueCards]);
    
    return (
        <>
            <div className={styles.deckContainer} onClick={() => setIsModalOpen(true)}>
                <p className={styles.deckCount}>{deck.counts.totalCards} cards</p>
                <p className={styles.deckName}>{deck.name}</p>
                <span className={styles.deckRepeat}>{deck.counts.dueCards}</span>
                <span className={styles.deckReview}>{review}</span>
            </div>
            <DeckMenuModal open={isModalOpen} onOpenChange={() => setIsModalOpen(false)} deck={deck}/>
        </>
    );
}

export default Deck;