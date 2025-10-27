import React, {useState} from 'react';
import styles from "../../card-list/card-list-footer/card-list-footer.module.css";
import {FolderOutput, Folders} from "lucide-react";
import {useCopyDeck} from "@/hooks/useCopyDeck";
import {ConfirmModal} from "@/components/ui/confirm-modal/confirm-modal";

type SharedCardListFooter = {
    cardsCount: number;
    onExport: () => void;
    deckId: number;
}

function SharedCardListFooter({cardsCount, onExport, deckId}: SharedCardListFooter) {
    const {mutate: copyDeck, isPending} = useCopyDeck();
    const [isConfirm, setIsConfirm] = useState(false);

    return (
        <>
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
                        onClick={() => {
                            setIsConfirm(true)
                        }} disabled={isPending}
                    >
                        <Folders/>
                    </button>
                </div>
            </footer>
            <ConfirmModal title={`Do you want to copy this deck?`} isOpen={isConfirm}
                          onClose={() => setIsConfirm(false)}
                          onConfirm={() => copyDeck(deckId)}
                          message={"This deck will be added to your account as a new deck with all cards included."}
            />
        </>
    );
}

export default SharedCardListFooter;