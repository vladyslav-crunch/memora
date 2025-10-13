"use client";

import React, {useEffect} from "react";
import Modal, {ModalBody, ModalFooter, ModalHeader} from "@/components/ui/modal/modal";
import Button, {BUTTON_COLOR, BUTTON_VARIANT} from "@/components/ui/button/button";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import Spinner from "@/components/ui/spinner/spinner";
import {toast} from "sonner";
import type {Card} from "@/lib/types/api";
import {useMoveCards} from "@/hooks/useCards";
import {useDecks} from "@/hooks/useDecks";
import {Select, type SelectOption} from "@/components/ui/select/select";

// Schema for selecting new deck
const MoveCardsSchema = z.object({
    newDeckId: z.number().int().min(1, "Please select a target deck"),
});

type MoveCardsValues = z.infer<typeof MoveCardsSchema>;

type MoveCardModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedCards: Card[];
    onMoveSuccess?: () => void;
};

export default function MoveCardModal({open, onOpenChange, selectedCards, onMoveSuccess}: MoveCardModalProps) {
    const moveCards = useMoveCards();
    const {data: decksData, isLoading: decksLoading} = useDecks();
    const decks = decksData?.items ?? [];

    const {handleSubmit, control, reset} = useForm<MoveCardsValues>({
        resolver: zodResolver(MoveCardsSchema),
        defaultValues: {newDeckId: undefined as unknown as number},
    });

    useEffect(() => {
        if (open) {
            reset({newDeckId: undefined as unknown as number});
        }
    }, [open, reset]);

    const onSubmit = async (values: MoveCardsValues) => {
        const newDeck = decks.find((d) => d.id === values.newDeckId);
        if (!newDeck) return;

        try {
            await moveCards.mutateAsync({
                cardIds: selectedCards.map((c) => c.id),
                newDeckId: newDeck.id,
            });
            toast.success("Cards moved successfully!");
            onOpenChange(false);
            if (onMoveSuccess) {
                onMoveSuccess()
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to move cards.");
        }
    };

    // Build options for Select component
    const options: SelectOption<number>[] = decks.map((deck) => ({
        value: deck.id,
        label: deck.name,
        disabled: selectedCards.some((c) => c.deckId === deck.id),
    }));

    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <ModalHeader>Move {selectedCards.length} card(s) to another deck</ModalHeader>
            <ModalBody>
                {decksLoading ? (
                    <div className="flex justify-center py-4">
                        <Spinner size={35}/>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="font-medium">Select target deck</span>
                            <Controller
                                name="newDeckId"
                                control={control}
                                render={({field}) => (
                                    <Select
                                        options={options}
                                        value={field.value ?? null}
                                        onChange={field.onChange}
                                        placeholder="-- Choose deck --"
                                    />
                                )}
                            />
                        </div>

                        <ModalFooter>
                            <Button
                                buttonType={BUTTON_VARIANT.modal}
                                buttonColor={BUTTON_COLOR.orange}
                                disabled={moveCards.isPending}
                                type="submit"
                            >
                                {moveCards.isPending ? <Spinner size={35}/> : "Move"}
                            </Button>
                        </ModalFooter>
                    </form>
                )}
            </ModalBody>
        </Modal>
    );
}
