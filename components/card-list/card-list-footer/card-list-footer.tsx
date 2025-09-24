import React from 'react';
import styles from "./card-list-footer.module.css";
import {FolderInput, Pencil, Trash2} from "lucide-react";

type CardListFooterProps = {
    selectedCardsCount: number;
    cardsCount: number;
    onDelete: () => void;
    onMove: () => void;
    onEdit: () => void;
}

function CardListFooter({selectedCardsCount, cardsCount, onDelete, onEdit, onMove}: CardListFooterProps) {
    return (
        <footer className={styles.cardsFooter}>
            <div>
                <h2>Total cards: {cardsCount}</h2>
            </div>
            <div className={styles.cardsFooterButtons}>
                <button style={{backgroundColor: "#EF6565"}} disabled={!selectedCardsCount}
                        onClick={onDelete}>
                    <Trash2/>
                </button>
                <button style={{backgroundColor: "#A983B7"}} disabled={!selectedCardsCount}
                        onClick={onMove}>
                    <FolderInput/>
                </button>
                <button
                    style={{backgroundColor: "#F98974"}}
                    disabled={selectedCardsCount !== 1}
                    onClick={onEdit}
                >
                    <Pencil/>
                </button>
            </div>
        </footer>
    );
}

export default CardListFooter;