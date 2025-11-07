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
import {ConfirmModal} from "@/components/ui/confirm-modal/confirm-modal";
import {useCopyDeck} from "@/hooks/useCopyDeck";


type DeckMenuModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    deck: PublicDeck;
};

function SharedDeckMenuModal({open, onOpenChange, deck}: DeckMenuModalProps) {
    const [isExport, setExport] = useState(false);
    const {mutate: copyDeck} = useCopyDeck();
    const [isConfirm, setIsConfirm] = useState(false);

    const router = useRouter();

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
                    onClick={() => setIsConfirm(true)}
                >
                    Copy deck
                </Button>
            </Modal>
            <ConfirmModal title={`Do you want to copy this deck?`} isOpen={isConfirm}
                          onClose={() => setIsConfirm(false)}
                          onConfirm={() => copyDeck(deck.id)}
                          message={"This deck will be added to your account as a new deck with all cards included."}
            />
            <ExportDeckModal deckId={deck.id} open={isExport} onOpenChange={() => setExport(false)} isPublic={true}/>
        </>
    );
}

export default SharedDeckMenuModal;
