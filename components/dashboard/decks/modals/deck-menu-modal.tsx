import React, {useState} from 'react';
import Modal from "@/components/ui/modal/modal";
import {Deck} from "@/lib/types/api";
import Button, {BUTTON_COLOR, BUTTON_VARIANT} from "@/components/ui/button/button";
import {Rocket, Plus, List, Pencil, FolderOutput, FolderInput} from "lucide-react";
import EditDeckModal from "@/components/dashboard/decks/modals/edit-deck-modal";
import AddCardModal from "@/components/dashboard/cards/modals/add-card-modal";
import {useRouter} from "next/navigation";

type DeckMenuModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void
    deck: Deck
};

function DeckMenuModal({open, onOpenChange, deck}: DeckMenuModalProps) {
    const [isEdit, setEdit] = useState(false);
    const [isAdd, setAdd] = useState(false);
    const router = useRouter()
    return (
        <>
            <Modal open={open} onOpenChange={onOpenChange} variant="compact">
                <Button
                    buttonType={BUTTON_VARIANT.modal}
                    buttonColor={BUTTON_COLOR.orangeLight}
                    icon={Rocket}
                    onClick={() => router.push("/practice")}
                >
                    Start learning
                </Button>

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
            <AddCardModal deck={deck} open={isAdd} onOpenChange={() => setAdd(false)}/>
        </>
    );
}

export default DeckMenuModal;