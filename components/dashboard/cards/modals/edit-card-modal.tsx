"use client";
import React, {useEffect} from "react";
import Modal, {ModalBody, ModalFooter, ModalHeader} from "@/components/ui/modal/modal";
import Button, {BUTTON_COLOR} from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import Spinner from "@/components/ui/spinner/spinner";
import {toast} from "sonner";
import {Card} from "@/lib/types/api";
import {UpdateCardSchema, type UpdateCardValues} from "@/lib/validation/card/card-shemas";
import {useUpdateCard} from "@/hooks/useCards";


type EditCardModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    card: Card;
};

export default function EditCardModal({open, onOpenChange, card}: EditCardModalProps) {
    const updateCard = useUpdateCard(card.id);

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<UpdateCardValues>({
        resolver: zodResolver(UpdateCardSchema),
        defaultValues: {
            deckId: card.deckId,
            front: card.front,
            back: card.back,
            context: card.context,
            intervalStrength: card.intervalStrength,
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                deckId: card.deckId,
                front: card.front,
                back: card.back,
                context: card.context ?? "",
                intervalStrength: card.intervalStrength,
            });
        }
    }, [card.deckId, card, open, reset]);

    const onSubmit = async (values: UpdateCardValues) => {
        try {
            await updateCard.mutateAsync({id: card.id, ...values});
            toast.success("Card updated successfully!");
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update card.");
        }
    };

    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <ModalHeader>Edit card</ModalHeader>
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

                    <ModalFooter>
                        <Button
                            buttonColor={BUTTON_COLOR.orange}
                            disabled={isSubmitting || updateCard.isPending}
                            type="submit"
                        >
                            {updateCard.isPending ? <Spinner size={35}/> : "Save changes"}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalBody>
        </Modal>
    );
}
