import React from 'react';
import styles from "../../card-list/card-list-footer/card-list-footer.module.css";
import {FolderOutput, Folders} from "lucide-react";

type CardListFooterProps = {
    cardsCount: number;
    onExport: () => void;
    onCopy: () => void;
}

function CardListFooter({cardsCount, onCopy, onExport}: CardListFooterProps) {
    return (
        <footer className={styles.cardsFooter}>
            <div>
                <h2>Total cards: {cardsCount}</h2>
            </div>
            <div className={styles.cardsFooterButtons}>
                <button style={{backgroundColor: "#A983B7"}}
                        onClick={onExport}>
                    <FolderOutput/>
                </button>
                <button
                    style={{backgroundColor: "#F98974"}}
                    onClick={onCopy}
                >
                    <Folders/>
                </button>
            </div>
        </footer>
    );
}

export default CardListFooter;