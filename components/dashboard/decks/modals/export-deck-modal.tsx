import React, {useState} from "react";
import Modal, {ModalBody, ModalFooter, ModalHeader} from "@/components/ui/modal/modal";
import Button, {BUTTON_COLOR} from "@/components/ui/button/button";
import {toast} from "sonner";
import {Copy, Download} from "lucide-react";
import {useCards} from "@/hooks/useCards";
import TextField from "@/components/ui/text-field/text-field";
import {getSeparator} from "@/lib/utility/getSeparator";
import {getPlaceholderExample} from "@/lib/utility/getPlaceholderExample";
import {copyToClipBoard} from "@/lib/utility/copyToClipBoard";
import {Deck} from "@/lib/types/deck.types";
import {SeparatorSelector} from "@/components/dashboard/decks/separator-selector";

type ExportDeckModalProps = {
    deck: Deck;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function ExportDeckModal({open, onOpenChange, deck}: ExportDeckModalProps) {
    const [fieldSeparator, setFieldSeparator] = useState<"tab" | "comma">("tab");
    const [rowSeparator, setRowSeparator] = useState<"semicolon" | "newline">("newline");
    const [output, setOutput] = useState("");
    const {data, isLoading} = useCards(deck?.id);


    const handleExport = () => {
        try {
            const cards = data?.items ?? [];

            if (isLoading) {
                toast.info("Loading cards...");
                return;
            }

            if (!cards.length) {
                toast.error("This deck has no cards to export.");
                return;
            }

            const fieldSep = getSeparator(fieldSeparator);
            const rowSep = getSeparator(rowSeparator);

            const exported = cards
                .map((card) => [card.front, card.back, card.context ?? ""].join(fieldSep))
                .join(rowSep);

            setOutput(exported);
            toast.success("Deck exported successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to export deck.");
        }
    };


    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <ModalHeader>Export Deck</ModalHeader>
            <ModalBody>
                <div className="flex flex-col gap-4">
                    {/* Field separator */}
                    <SeparatorSelector
                        fieldSeparator={fieldSeparator}
                        rowSeparator={rowSeparator}
                        onFieldChange={setFieldSeparator}
                        onRowChange={setRowSeparator}
                    />
                    <div>
                        <div className="flex flex-col gap-2 ">
                            <TextField
                                name="output"
                                label="Exported Data Output"
                                placeholder={getPlaceholderExample(fieldSeparator, rowSeparator)}
                                option="modal"
                                value={output}
                                onChange={(e) => setOutput(e.target.value)}
                                rows={8}
                                readOnly
                            />
                            <div className="flex justify-end">
                                <button onClick={() => copyToClipBoard(output)} className="flex gap-2 cursor-pointer">
                                    <Copy/> Copy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button
                    buttonColor={BUTTON_COLOR.orange}
                    onClick={handleExport}
                    disabled={isLoading}
                >
                    <Download className="mr-2"/> Export
                </Button>
            </ModalFooter>
        </Modal>
    );
}
