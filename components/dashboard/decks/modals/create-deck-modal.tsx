import React from "react";
import Modal, {ModalBody, ModalFooter, ModalHeader} from "@/components/ui/modal/modal";
import Button, {BUTTON_COLOR} from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import ToggleGroup, {ToggleOption} from "@/components/ui/toggle/toggle-group";
import Switch from "@/components/ui/switch/switch";

import {
    CreateDeckSchema,
    type CreateDeckInput,
    type CreateDeckValues,
} from "@/lib/validation/deck/deck-schemas";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useCreateDeck} from "@/hooks/useDecks";
import Spinner from "@/components/ui/spinner/spinner";
import {toast} from "sonner";
import {Deck} from "@/lib/types/api";

const MODE_OPTIONS: ToggleOption[] = [
    {id: "normal", label: "Normal"},
    {id: "reversed", label: "Reversed"},
    {id: "typing", label: "Typing"},
];

type CreateDeckModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated?: (deck: Deck) => void;
};

export default function CreateDeckModal({open, onOpenChange, onCreated}: CreateDeckModalProps) {
    const createDeck = useCreateDeck();

    const defaultsOutput: CreateDeckValues = CreateDeckSchema.parse({});

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<CreateDeckInput>({
        resolver: zodResolver(CreateDeckSchema),
        defaultValues: defaultsOutput as CreateDeckInput,
    });

    const toSelectedIds = (v: CreateDeckInput) => {
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
        reset(defaultsOutput as CreateDeckInput);
        onOpenChange(false);
    };

    const onSubmit = async (values: CreateDeckInput) => {
        const payload: CreateDeckValues = CreateDeckSchema.parse(values);

        try {
            const deck = await createDeck.mutateAsync(payload);
            closeAndReset();
            toast.success("Deck created successfully!");
            if (onCreated) onCreated(deck);
        } catch (error) {
            console.error(error);
            toast.error("Failed to create deck.");
        }
    };

    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <ModalHeader>Create new deck</ModalHeader>
            <ModalBody>
                <form onSubmit={(e) => {
                    e.preventDefault(); // ✅ stop native dialog close
                    handleSubmit(onSubmit)(e); // run RHF submit + validation
                }} className="flex flex-col gap-3">
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
                    <div>
                        <label
                            style={{
                                display: "block",
                                fontSize: "18px",
                                color: "#333",
                                marginBottom: "8px",
                            }}
                        >
                            Visibility
                        </label>
                        <Controller
                            control={control}
                            name="isPrivate"
                            render={({field}) => (
                                <Switch
                                    label="Public"
                                    checked={!field.value}
                                    onChange={(v) => field.onChange(!v)}
                                />
                            )}
                        />
                    </div>


                    <ModalFooter>
                        <Button
                            buttonColor={BUTTON_COLOR.orange}
                            disabled={isSubmitting || createDeck.isPending}
                            type="submit"
                        >
                            {createDeck.isPending ? <Spinner size={35}/> : "Create"}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalBody>
        </Modal>
    );
}
