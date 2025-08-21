"use client";
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

const MODE_OPTIONS: ToggleOption[] = [{id: "normal", label: "Normal"}, {
    id: "reversed",
    label: "Reversed"
}, {id: "typing", label: "Typing"}, {id: "randomized", label: "Randomized"},];

type CreateDeckModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void
};

export default function CreateDeckModal({open, onOpenChange}: CreateDeckModalProps) {
    const createDeck = useCreateDeck();

    // schema defaults (OUTPUT)
    const defaultsOutput: CreateDeckValues = CreateDeckSchema.parse({});

    // RHF must use the INPUT type:
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<CreateDeckInput>({
        resolver: zodResolver(CreateDeckSchema),   // Resolver<input, any, output>
        // defaultValues can be the output; it's assignable to the input structurally
        defaultValues: defaultsOutput as CreateDeckInput,
    });

    // helpers now use INPUT type for watch()
    const toSelectedIds = (v: CreateDeckInput) => {
        const sel: string[] = [];
        if (v.isQuizNormal) sel.push("normal");
        if (v.isQuizReversed) sel.push("reversed");
        if (v.isQuizTyping) sel.push("typing");
        if (v.isQuizRandomized) sel.push("randomized");
        return sel;
    };

    const applySelectedIds = (ids: string[]) => {
        setValue("isQuizNormal", ids.includes("normal"), {shouldValidate: true});
        setValue("isQuizReversed", ids.includes("reversed"), {shouldValidate: true});
        setValue("isQuizTyping", ids.includes("typing"), {shouldValidate: true});
        setValue("isQuizRandomized", ids.includes("randomized"), {shouldValidate: true});
    };

    const selectedIds = toSelectedIds(watch());

    const closeAndReset = () => {
        reset(defaultsOutput as CreateDeckInput);
        onOpenChange(false);
    };

    // onSubmit receives INPUT; coerce once to OUTPUT for API
    const onSubmit = async (values: CreateDeckInput) => {
        const payload: CreateDeckValues = CreateDeckSchema.parse(values);

        try {
            await createDeck.mutateAsync(payload);
            closeAndReset();
            toast.success("Deck created successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create deck.");
        }
    };

    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <ModalHeader>Create new deck</ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <div>
                        <Input
                            label="Deck name"
                            placeholder="Enter deck name"
                            error={errors.name?.message}
                            {...register("name")}
                            option="modal"
                        />
                    </div>
                    <div>
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
                        {"modes" in errors && (
                            <p style={{color: "#b91c1c", fontSize: 12, marginTop: 6}}>
                                {(errors as any).modes?.message}
                            </p>
                        )}
                    </div>

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
                </form>
            </ModalBody>

            <ModalFooter>
                <Button
                    buttonColor={BUTTON_COLOR.orange}
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting || createDeck.isPending}
                >
                    {createDeck.isPending ? <Spinner size={35}/> : "Create"}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
