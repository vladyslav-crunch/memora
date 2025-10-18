import React, {useEffect, useState} from "react";
import Modal, {ModalBody, ModalFooter, ModalHeader} from "@/components/ui/modal/modal";
import Button, {BUTTON_COLOR} from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import ToggleGroup, {ToggleOption} from "@/components/ui/toggle/toggle-group";
import Switch from "@/components/ui/switch/switch";
import {Trash2} from "lucide-react";
import {UpdateDeckInput, UpdateDeckSchema,} from "@/lib/validation/deck/deck-update.schema";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useDeleteDeck, useUpdateDeck} from "@/hooks/useDecks"; // <-- use update, not create
import Spinner from "@/components/ui/spinner/spinner";
import {ConfirmModal} from "@/components/ui/confirm-modal/confirm-modal";
import {toast} from "sonner";
import {Deck} from "@/lib/types/deck.types";

const MODE_OPTIONS: ToggleOption[] = [
    {id: "normal", label: "Normal"},
    {id: "reversed", label: "Reversed"},
    {id: "typing", label: "Typing"},
];

type UpdateDeckModalProps = {
    deck: Deck;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function EditDeckModal({open, onOpenChange, deck}: UpdateDeckModalProps) {
    const updateDeck = useUpdateDeck(deck.id);
    const deleteDeck = useDeleteDeck(deck.id);
    const [isConfirm, setIsConfirm] = useState(false);
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<UpdateDeckInput>({
        resolver: zodResolver(UpdateDeckSchema),
        defaultValues: deck as UpdateDeckInput, // prefill with deck
    });

    // reset when deck changes

    useEffect(() => {
        reset(deck as UpdateDeckInput);
    }, [deck, reset]);

    const toSelectedIds = (v: UpdateDeckInput) => {
        const sel: string[] = [];
        if (v.isQuizNormal) sel.push("normal");
        if (v.isQuizReversed) sel.push("reversed");
        if (v.isQuizTyping) sel.push("typing");
        return sel;
    };

    const applySelectedIds = (ids: string[]) => {
        setValue("isQuizNormal", ids.includes("normal"), {shouldValidate: true});
        setValue("isQuizReversed", ids.includes("reversed"), {shouldValidate: true});
        setValue("isQuizTyping", ids.includes("typing"), {shouldValidate: true});
    };

    const selectedIds = toSelectedIds(watch());

    const closeAndReset = () => {
        reset(deck as UpdateDeckInput);
        onOpenChange(false);
    };


    const handleDelete = async () => {
        try {
            await deleteDeck.mutateAsync();
            setIsConfirm(false);
            onOpenChange(false);
            toast.success(`Deck "${deck.name}" deleted successfully!`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete deck.");
        }
    };

    const onSubmit = async (values: UpdateDeckInput) => {
        const payload = UpdateDeckSchema.parse(values);
        try {
            await updateDeck.mutateAsync({id: deck.id, ...payload});
            closeAndReset();
            toast.success("Deck updated successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update deck.");
        }
    };


    return (
        <>
            <Modal open={open} onOpenChange={onOpenChange}>
                <ModalHeader>Edit deck</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                        <Input
                            label="Deck name"
                            placeholder="Enter deck name"
                            error={errors.name?.message}
                            {...register("name")}
                            option="modal"
                        />
                        <ToggleGroup
                            label="Modes"
                            options={MODE_OPTIONS}
                            value={selectedIds}
                            onChange={(ids) => {
                                if (ids.length < 1) return;
                                applySelectedIds(ids);
                            }}
                            minSelected={1}
                        />
                        <div>
                            <label style={{display: "block", fontSize: "18px", color: "#333", marginBottom: "8px"}}>
                                Visibility
                            </label>
                            <Controller
                                control={control}
                                name="isPrivate"
                                render={({field}) => (
                                    <Switch label="Public" checked={!field.value} onChange={(v) => field.onChange(!v)}/>
                                )}
                            />
                        </div>
                        <div>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "18px",
                                    color: "#333",
                                    marginBottom: "8px",
                                }}
                            >
                                Order
                            </label>
                            <Controller
                                control={control}
                                name="isQuizRandomized"
                                render={({field}) => (
                                    <Switch
                                        label="Randomized"
                                        checked={!!field.value}
                                        onChange={(v) => field.onChange(v)}
                                    />
                                )}
                            />
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => setIsConfirm(true)} buttonColor={BUTTON_COLOR.red}
                            style={{width: "100px"}}><Trash2/></Button>
                    <Button
                        buttonColor={BUTTON_COLOR.orange}
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting || updateDeck.isPending}
                    >
                        {updateDeck.isPending ? <Spinner size={35}/> : "Save"}
                    </Button>
                </ModalFooter>
            </Modal>
            <ConfirmModal title={`Delete deck "${deck.name}"`} isOpen={isConfirm}
                          onClose={() => setIsConfirm(false)}
                          onConfirm={handleDelete}
                          message={"Are you sure you want to delete this deck? This action cannot be undone."}
            />
        </>
    );
}
