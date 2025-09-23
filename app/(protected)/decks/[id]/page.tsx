"use client";
import styles from "./deck-page.module.css";
import React, {use, useState} from "react";
import {useCards, useDeleteCards} from "@/hooks/useCards";
import {bucketFromInterval} from "@/lib/api/progression-helpers";
import {FolderInput, Pencil, Trash2} from "lucide-react";
import Checkbox from "@/components/ui/checkbox/checkbox";
import EditCardModal from "@/components/dashboard/cards/modals/edit-card-modal";
import type {Card} from "@/lib/types/api";
import MoveCardModal from "@/components/dashboard/cards/modals/move-card-modal";
import {ConfirmModal} from "@/components/ui/confirm-modal/confirm-modal";

function DeckPage({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params);
    const {data: cards, isLoading, error} = useCards(Number(id));

    const [selectedCards, setSelectedCards] = useState<Card[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isMoveCardOpen, setMoveCardOpen] = useState(false);
    const [isConfirmOpen, setConfirmOpen] = useState(false);

    const deleteCards = useDeleteCards(Number(id));


    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Failed to load deck</div>;
    if (!cards) return <div>No deck found</div>;

    function formatDateTime(dateString: string) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const allSelected = selectedCards.length === cards.items.length;

    const toggleAll = () => {
        if (allSelected) {
            setSelectedCards([]);
        } else {
            setSelectedCards(cards.items);
        }
    };

    const handleDelete = async () => {
        if (!selectedCards.length) return;

        await deleteCards.mutateAsync({
            deckId: Number(id),
            cardIds: selectedCards.map((c) => c.id),
        });

        setSelectedCards([]); // clear selection
    };

    const toggleRow = (card: Card) => {
        setSelectedCards((prev) =>
            prev.some((c) => c.id === card.id)
                ? prev.filter((c) => c.id !== card.id)
                : [...prev, card]
        );
    };

    const isCardSelected = (card: Card) =>
        selectedCards.some((c) => c.id === card.id);

    return (
        <>
            <h1 className={styles.title}>Deck {id}</h1>
            <div className={styles.cardTableContainer}>
                <table className={styles.table}>
                    <colgroup>
                        <col style={{width: "2%"}}/>
                        <col style={{width: "40%"}}/>
                        <col style={{width: "10%", textAlign: "center"}}/>
                        <col style={{width: "20%"}}/>
                        <col style={{width: "10%"}}/>
                    </colgroup>
                    <thead className={styles.thead}>
                    <tr>
                        <th className={styles.th}>
                            <Checkbox checked={allSelected} onChange={toggleAll}/>
                        </th>
                        <th className={styles.th}>Front/Back/Context</th>
                        <th className={styles.th}>Interval strength</th>
                        <th className={styles.th}>Next repetition</th>
                        <th className={styles.th}>Memory Level</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cards.items.map((card: Card) => {
                        const level = bucketFromInterval(card.intervalStrength);
                        return (
                            <tr
                                key={card.id}
                                className={`${styles.tr} ${
                                    isCardSelected(card) ? styles.selected : ""
                                }`}
                            >
                                <td className={styles.td}>
                                    <Checkbox
                                        checked={isCardSelected(card)}
                                        onChange={() => toggleRow(card)}
                                    />
                                </td>
                                <td className={styles.td}>
                                    <p className={styles.cardFront}>{card.front}</p>
                                    <p className={styles.cardBack}>{card.back}</p>
                                    <p className={styles.cardContext}>{card.context}</p>
                                </td>
                                <td className={styles.td}>{card.intervalStrength}</td>
                                <td className={styles.td}>
                                    {card.nextRepetitionTime ? formatDateTime(card.nextRepetitionTime) : <p>-</p>}
                                </td>
                                <td className={styles.td}>
                    <span
                        className={`${styles.cardLevel} ${
                            styles[level] || ""
                        }`}
                    >
                      {level}
                    </span>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
            <footer className={styles.cardsFooter}>
                <div>
                    <h2>Total cards: {cards.items.length}</h2>
                </div>
                <div className={styles.cardsFooterButtons}>
                    <button style={{backgroundColor: "#EF6565"}} disabled={!selectedCards.length}
                            onClick={() => setConfirmOpen(true)}>
                        <Trash2/>
                    </button>
                    <button style={{backgroundColor: "#A983B7"}} disabled={!selectedCards.length}
                            onClick={() => setMoveCardOpen(true)}>
                        <FolderInput/>
                    </button>
                    <button
                        style={{backgroundColor: "#F98974"}}
                        disabled={selectedCards.length !== 1}
                        onClick={() => setEditModalOpen(true)}
                    >
                        <Pencil/>
                    </button>
                </div>
            </footer>

            {selectedCards.length === 1 && (
                <EditCardModal
                    open={isEditModalOpen}
                    onOpenChange={setEditModalOpen}
                    card={selectedCards[0]}
                />
            )}
            {selectedCards.length !== 0 && (
                <MoveCardModal
                    open={isMoveCardOpen}
                    onOpenChange={setMoveCardOpen}
                    selectedCards={selectedCards}
                    onMoveSuccess={() => setSelectedCards([])}
                />
            )}
            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Delete cards"
                message={`Are you sure you want to delete ${selectedCards.length} card(s)?`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />
        </>
    );
}

export default DeckPage;
