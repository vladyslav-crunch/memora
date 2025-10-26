"use client";
import React, {use, useState} from "react";
import Spinner from "@/components/ui/spinner/spinner";
import styles from '../../card-list/[id]/card-list.module.css'
import SharedCardListHeader from "@/components/shared-card-list/shared-card-list-header/shared-card-list-header";
import {usePublicDeck} from "@/hooks/usePublicDeck";
import {usePublicCards} from "@/hooks/usePublicCards";
import SharedCardListTable from "@/components/shared-card-list/shared-card-list-table/shared-card-list-table";
import {useSearchStore} from "@/stores/useSearchStore";
import SharedCardListFooter from "@/components/shared-card-list/shared-card-list-footer/shared-card-list-footer";
import ExportDeckModal from "@/components/dashboard/decks/modals/export-deck-modal";

function SharedCardListPage({params}: { params: Promise<{ id: string }> }) {
    const [isExportModalOpen, setExportModalOpen] = useState(false);
    const {id} = use(params);
    const search = useSearchStore((s) => s.debouncedValue);

    const {data: deck, isLoading: loadingDecks, error} = usePublicDeck(Number(id));
    const {data: cards, isLoading: loadingCards} = usePublicCards(Number(id), {search});

    if (loadingDecks || loadingCards) return <div className={styles.cardListLoading}><Spinner size={60}/></div>;
    if (error) return <div>Failed to load deck</div>;
    if (!deck || !cards) return <div>No deck found</div>;

    return (
        <>
            <SharedCardListHeader deck={deck}/>
            <SharedCardListTable cards={cards}/>
            <SharedCardListFooter cardsCount={cards.total} onExport={() => setExportModalOpen(true)} onCopy={() => {
            }}/>

            {isExportModalOpen && <ExportDeckModal deckId={deck.id} open={isExportModalOpen}
                                                   onOpenChange={() => setExportModalOpen(false)}
                                                   isPublic={true}/>}
        </>
    );
}

export default SharedCardListPage;
