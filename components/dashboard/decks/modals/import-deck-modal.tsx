import React, {useState} from "react";
import Modal, {ModalBody, ModalFooter, ModalHeader} from "@/components/ui/modal/modal";
import Button, {BUTTON_COLOR} from "@/components/ui/button/button";
import {toast} from "sonner";
import {Upload} from "lucide-react";
import TextField from "@/components/ui/text-field/text-field";
import {useImportCards} from "@/hooks/useImportCards";
import {z} from "zod";
import {getSeparator} from "@/lib/utility/getSeparator";
import {getPlaceholderExample} from "@/lib/utility/getPlaceholderExample";
import {Deck} from "@/lib/types/deck.types";
import {ImportCardSchema} from "@/lib/validation/card/import-cards.schema";
import {SeparatorSelector} from "@/components/dashboard/decks/separator-selector";

type ImportDeckModalProps = {
    deck: Deck;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};


export default function ImportDeckModal({open, onOpenChange, deck}: ImportDeckModalProps) {
    const [fieldSeparator, setFieldSeparator] = useState<"tab" | "comma">("tab");
    const [rowSeparator, setRowSeparator] = useState<"semicolon" | "newline">("newline");
    const [input, setInput] = useState("");
    const importCards = useImportCards();


    const handleImport = async () => {
        try {
            if (!input.trim()) {
                toast.error("Please paste or enter some text to import.");
                return;
            }

            const fieldSep = getSeparator(fieldSeparator);
            const rowSep = getSeparator(rowSeparator);

            const rows = input.split(rowSep).map((r) => r.trim()).filter(Boolean);

            if (rows.length === 0) {
                toast.error("No valid rows found in the text.");
                return;
            }

            const validCards: z.infer<typeof ImportCardSchema>[] = [];
            const invalidRows: string[] = [];

            rows.forEach((row, i) => {
                const [front, back, context] = row
                    .split(fieldSep)
                    .map((val) => val.trim());

                const parsed = ImportCardSchema.safeParse({front, back, context});

                if (parsed.success) {
                    validCards.push(parsed.data);
                } else {
                    invalidRows.push(`Row ${i + 1}`);
                }
            });

            if (invalidRows.length > 0) {
                toast.error(
                    `Import failed — ${invalidRows.length} invalid row(s): ${invalidRows.join(", ")}`
                );
                return;
            }

            if (validCards.length === 0) {
                toast.error("No valid cards found — please check your data format.");
                return;
            }

            await importCards.mutateAsync({
                deckId: deck.id,
                cards: validCards,
            });

            toast.success(`Successfully imported ${validCards.length} cards.`);
            setInput("");
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to import deck.");
        }
    };


    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <ModalHeader>Import Deck</ModalHeader>
            <ModalBody>
                <div className="flex flex-col gap-4">
                    {/* Field separator */}
                    <SeparatorSelector
                        fieldSeparator={fieldSeparator}
                        rowSeparator={rowSeparator}
                        onFieldChange={setFieldSeparator}
                        onRowChange={setRowSeparator}
                    />

                    {/* Input field with preview */}
                    <div>
                        <TextField
                            name="input"
                            label="Paste cards to import:"
                            placeholder={getPlaceholderExample(fieldSeparator, rowSeparator)}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            rows={8}
                            option="modal"
                            onKeyDown={(e) => {
                                if (e.key === "Tab") {
                                    e.preventDefault();
                                    const target = e.target as HTMLTextAreaElement;
                                    const start = target.selectionStart;
                                    const end = target.selectionEnd;
                                    const newValue =
                                        input.substring(0, start) + "\t" + input.substring(end);
                                    setInput(newValue);
                                    requestAnimationFrame(() => {
                                        target.selectionStart = target.selectionEnd = start + 1;
                                    });
                                }
                            }}
                        />
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button
                    buttonColor={BUTTON_COLOR.orange}
                    onClick={handleImport}
                    disabled={importCards.isPending}
                >
                    <Upload className="mr-2"/> Import
                </Button>
            </ModalFooter>
        </Modal>
    );
}
