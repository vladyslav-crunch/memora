"use client";
import React, {useState} from "react";
import Modal from "@/components/ui/modal/modal";
import {Deck} from "@/lib/types/api";
import Button, {
    BUTTON_COLOR,
    BUTTON_VARIANT,
} from "@/components/ui/button/button";
import {
    Rocket,
    Plus,
    List,
    Pencil,
    FolderOutput,
    FolderInput,
} from "lucide-react";
import EditDeckModal from "@/components/dashboard/decks/modals/edit-deck-modal";
import AddCardModal from "@/components/dashboard/cards/modals/add-card-modal";
import {useRouter} from "next/navigation";
import {useDueCards} from "@/hooks/useDueCards";
import {NoCardsModal} from "@/components/ui/no-cards-modal/no-cards.modal";
import {useCardsExist} from "@/hooks/useCardsExist";
import ExportDeckModal from "@/components/dashboard/decks/modals/export-deck-modal";
import ImportDeckModal from "@/components/dashboard/decks/modals/import-deck-modal";


type DeckMenuModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    deck: Deck;
};

function DeckMenuModal({open, onOpenChange, deck}: DeckMenuModalProps) {
    const [isEdit, setEdit] = useState(false);
    const [isAdd, setAdd] = useState(false);
    const [isExport, setExport] = useState(false);
    const [isImport, setImport] = useState(false);
    const [showNoCards, setShowNoCards] = useState(false);

    const router = useRouter();
    const {data: dueCardsExist} = useDueCards(deck.id);
    const {data: cardsExist} = useCardsExist(deck.id);
    const startPractice = () => {
        router.push(`/practice?deckId=${deck.id}`);
    };

    const handleStartPractice = () => {
        if (dueCardsExist?.hasDue) {
            startPractice();
        } else {
            setShowNoCards(true);
        }
    };

    return (
        <>
            <Modal open={open} onOpenChange={onOpenChange} variant="compact">
                {cardsExist?.exists && (
                    <Button
                        buttonType={BUTTON_VARIANT.modal}
                        buttonColor={BUTTON_COLOR.orangeLight}
                        icon={Rocket}
                        onClick={handleStartPractice}
                    >
                        Start learning
                    </Button>
                )}

                <Button
                    onClick={() => setAdd(true)}
                    buttonType={BUTTON_VARIANT.modal}
                    buttonColor={BUTTON_COLOR.orangeLight}
                    icon={Plus}
                    iconSize={21}
                >
                    Add new card
                </Button>

                <Button
                    buttonType={BUTTON_VARIANT.modal}
                    buttonColor={BUTTON_COLOR.orangeLight}
                    icon={List}
                    onClick={() => router.push(`/card-list/${deck.id}`)}
                >
                    Card list
                </Button>

                <Button
                    buttonType={BUTTON_VARIANT.modal}
                    buttonColor={BUTTON_COLOR.orangeLight}
                    icon={Pencil}
                    onClick={() => setEdit(true)}
                >
                    Edit deck
                </Button>

                <Button
                    buttonType={BUTTON_VARIANT.modal}
                    buttonColor={BUTTON_COLOR.orangeLight}
                    icon={FolderInput}
                    onClick={() => setImport(true)}
                >
                    Import cards
                </Button>

                <Button
                    buttonType={BUTTON_VARIANT.modal}
                    buttonColor={BUTTON_COLOR.orangeLight}
                    icon={FolderOutput}
                    onClick={() => setExport(true)}
                >
                    Export cards
                </Button>
            </Modal>

            {/* Sub-modals */}
            <EditDeckModal deck={deck} open={isEdit} onOpenChange={() => setEdit(false)}/>
            <AddCardModal deck={deck} open={isAdd} onOpenChange={() => setAdd(false)}/>
            <ExportDeckModal deck={deck} open={isExport} onOpenChange={() => setExport(false)}/>
            <ImportDeckModal deck={deck} open={isImport} onOpenChange={() => setImport(false)}/>

            {/* No cards modal */}
            <NoCardsModal
                isOpen={showNoCards}
                onClose={() => setShowNoCards(false)}
                onConfirm={startPractice}
            />
        </>
    );
}

export default DeckMenuModal;
