"use client";
import React, {use, useState} from "react";
import {useCards, useDeleteCards} from "@/hooks/useCards";
import EditCardModal from "@/components/dashboard/cards/modals/edit-card-modal";
import MoveCardModal from "@/components/dashboard/cards/modals/move-card-modal";
import {ConfirmModal} from "@/components/ui/confirm-modal/confirm-modal";
import CardListTable from "@/components/card-list/card-list-table/card-list-table";
import CardListFooter from "@/components/card-list/card-list-footer/card-list-footer";
import CardListHeader from "@/components/card-list/card-list-header/card-list-header";
import Spinner from "@/components/ui/spinner/spinner";
import styles from './card-list.module.css'
import {useDeck} from "@/hooks/useDecks";
import {useSearchStore} from "@/stores/useSearchStore";
import SortCardsModal from "@/components/dashboard/cards/modals/sort-card-modal";
import {Card} from "@/lib/types/card.types";

function CardListPage({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params);
    const [selectedCards, setSelectedCards] = useState<Card[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isMoveCardOpen, setMoveCardOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);
    const [isSortOpen, setSortOpen] = useState(false);

    const [sortBy, setSortBy] = useState<"intervalStrength" | "nextRepetitionTime" | "createdAt" | undefined>("intervalStrength");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    const {data: deck} = useDeck(Number(id));
    const search = useSearchStore((s) => s.debouncedValue);

    const {data: cards, isLoading, error} = useCards(Number(id), {
        search,
        sortBy,
        sortOrder,
    });

    const deleteCards = useDeleteCards(Number(id));

    if (isLoading) return <div className={styles.cardListLoading}><Spinner size={60}/></div>;
    if (error) {
        console.log(error)
        return <div>Failed to load deck</div>;
    }
    if (!deck || !cards) return <div>No deck found</div>;

    const toggleAll = () => {
        if (selectedCards.length === cards.items.length) {
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
        setSelectedCards([]);
    };

    const toggleRow = (card: Card) => {
        setSelectedCards((prev) =>
            prev.some((c) => c.id === card.id)
                ? prev.filter((c) => c.id !== card.id)
                : [...prev, card]
        );
    };


    return (
        <>
            <CardListHeader deck={deck} onSort={() => setSortOpen(true)}/>
            <CardListTable cards={cards} selectedCards={selectedCards} onToggleAll={toggleAll} onToggleRow={toggleRow}/>
            <CardListFooter selectedCardsCount={selectedCards.length} cardsCount={cards.items.length}
                            onDelete={() => setDeleteOpen(true)} onMove={() => setMoveCardOpen(true)}
                            onEdit={() => setEditModalOpen(true)}/>

            {selectedCards.length === 1 && (
                <EditCardModal
                    open={isEditModalOpen}
                    onOpenChange={setEditModalOpen}
                    card={selectedCards[0]}
                    onEditSuccess={() => setSelectedCards([])}
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
                isOpen={isDeleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete cards"
                message={`Are you sure you want to delete ${selectedCards.length} card(s)?`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />
            <SortCardsModal
                open={isSortOpen}
                onOpenChange={setSortOpen}
                onApply={(newSortBy, newSortOrder) => {
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                }}
                initialSort={{sortBy, sortOrder}}
            />
        </>
    );
}

export default CardListPage;
