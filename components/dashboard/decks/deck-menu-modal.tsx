import React, {useState} from 'react';
import Modal from "@/components/ui/modal/modal";
import {DeckStatsItem} from "@/lib/types/api";
import Button, {BUTTON_COLOR, BUTTON_VARIANT} from "@/components/ui/button/button";
import {Rocket, Plus, List, Pencil, FolderOutput, FolderInput} from "lucide-react";
import EditDeckModal from "@/components/dashboard/decks/edit-deck-modal";

type DeckMenuModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void
    deck: DeckStatsItem
};

function DeckMenuModal({open, onOpenChange, deck}: DeckMenuModalProps) {
    const [isEdit, setEdit] = useState(false);
    return (
        <>
            <Modal open={open} onOpenChange={onOpenChange} variant="compact">
                <Button
                    buttonType={BUTTON_VARIANT.modal}
                    buttonColor={BUTTON_COLOR.orangeLight}
                    icon={Rocket}
                >
                    Start learning
                </Button>

                <Button
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
                >
                    Card list
                </Button>

                <Button
                    buttonType={BUTTON_VARIANT.modal}
                    buttonColor={BUTTON_COLOR.orangeLight}
                    icon={Pencil}
                    onClick={() => {
                        setEdit(true)
                    }}
                >
                    Edit deck
                </Button>
                <Button
                    buttonType={BUTTON_VARIANT.modal}
                    buttonColor={BUTTON_COLOR.orangeLight}
                    icon={FolderInput}
                >
                    Import cards
                </Button>
                <Button
                    buttonType={BUTTON_VARIANT.modal}
                    buttonColor={BUTTON_COLOR.orangeLight}
                    icon={FolderOutput}
                >
                    Export cards
                </Button>
            </Modal>
            <EditDeckModal deck={deck} open={isEdit} onOpenChange={() => setEdit(false)}/>
        </>
    );
}

export default DeckMenuModal;