"use client";
import React, {useState} from "react";
import Modal from "@/components/ui/modal/modal";
import Button, {
    BUTTON_COLOR,
    BUTTON_VARIANT,
} from "@/components/ui/button/button";
import {
    List,
    FolderOutput,
    Folders,
} from "lucide-react";
import {useRouter} from "next/navigation";
import ExportDeckModal from "@/components/dashboard/decks/modals/export-deck-modal";
import {PublicDeck} from "@/lib/types/shared-deck.types";


type DeckMenuModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    deck: PublicDeck;
};

function SharedDeckMenuModal({open, onOpenChange, deck}: DeckMenuModalProps) {
    const [isExport, setExport] = useState(false);

    const router = useRouter();
    const handleCopyDeck = () => {
        alert("this deck will be copied!");
    }

    return (
        <>
            <Modal open={open} onOpenChange={onOpenChange} variant="compact">

                <Button
                    buttonType={BUTTON_VARIANT.modal}
                    buttonColor={BUTTON_COLOR.orangeLight}
                    icon={List}
                    onClick={() => router.push(`/shared/${deck.id}`)}
                >
                    Card list
                </Button>

                <Button
                    buttonType={BUTTON_VARIANT.modal}
                    buttonColor={BUTTON_COLOR.orangeLight}
                    icon={FolderOutput}
                    onClick={() => setExport(true)}
                >
                    Export cards
                </Button>
                <Button
                    buttonType={BUTTON_VARIANT.modal}
                    buttonColor={BUTTON_COLOR.orangeLight}
                    icon={Folders}
                    onClick={handleCopyDeck}
                >
                    Copy deck
                </Button>
            </Modal>
            <ExportDeckModal deckId={deck.id} open={isExport} onOpenChange={() => setExport(false)} isPublic={true}/>
        </>
    );
}

export default SharedDeckMenuModal;
