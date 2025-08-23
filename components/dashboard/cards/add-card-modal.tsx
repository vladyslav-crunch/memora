"use client";
import React from "react";
import Modal, {ModalBody, ModalFooter, ModalHeader} from "@/components/ui/modal/modal";
import Button, {BUTTON_COLOR} from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import Spinner from "@/components/ui/spinner/spinner";
import {toast} from "sonner";
import {DeckStatsItem} from "@/lib/types/api";
import {CreateCardSchema, type CreateCardValues} from "@/lib/validation/card/card-shemas";

// ⚡️ you’ll need a useCreateCard hook (similar to useCreateDeck)
import {useCreateCard} from "@/hooks/useCards";

type AddCardModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    deck: DeckStatsItem;
};

export default function AddCardModal({open, onOpenChange, deck}: AddCardModalProps) {
    const createCard = useCreateCard();

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<CreateCardValues>({
        resolver: zodResolver(CreateCardSchema),
        defaultValues: {
            deckId: deck.id,
            front: "",
            back: "",
            context: "",
            intervalStrength: null,
        },
    });

    const closeAndReset = () => {
        reset({
            deckId: deck.id,
            front: "",
            back: "",
            context: "",
            intervalStrength: null,
        });
        onOpenChange(false);
    };

    const onSubmit = async (values: CreateCardValues) => {
        try {
            await createCard.mutateAsync(values);
            closeAndReset();
            toast.success("Card added successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add card.");
        }
    };

    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <ModalHeader>Add card to deck {`"${deck.name}"`}</ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <Input
                        label="Front side"
                        placeholder="Apfel"
                        error={errors.front?.message}
                        {...register("front")}
                        option="modal"
                    />
                    <Input
                        label="Back side"
                        placeholder="Apple"
                        error={errors.back?.message}
                        {...register("back")}
                        option="modal"
                    />
                    <Input
                        label="In context (optional)"
                        placeholder="Round fruit from trees"
                        error={errors.context?.message}
                        {...register("context")}
                        option="modal"
                    />
                </form>
            </ModalBody>

            <ModalFooter>
                <Button
                    buttonColor={BUTTON_COLOR.orange}
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting || createCard.isPending}
                >
                    {createCard.isPending ? <Spinner size={35}/> : "Add"}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
