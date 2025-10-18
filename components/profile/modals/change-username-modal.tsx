import React, {useEffect} from "react";
import Modal, {ModalBody, ModalFooter, ModalHeader} from "@/components/ui/modal/modal";
import Button, {BUTTON_COLOR, BUTTON_VARIANT} from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import Spinner from "@/components/ui/spinner/spinner";
import {useUser} from "@/hooks/useUser";
import {toast} from "sonner";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ChangeUsernameSchema, ChangeUsernameValues} from "@/lib/validation/user/change-username.schema";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentName: string;
};

export default function ChangeUsernameModal({open, onOpenChange, currentName}: Props) {
    const {updateUser, isUpdating} = useUser();

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<ChangeUsernameValues>({
        resolver: zodResolver(ChangeUsernameSchema),
        defaultValues: {name: currentName},
    });

    useEffect(() => {
        if (open) reset({name: currentName});
    }, [open, currentName, reset]);

    const onSubmit = async (values: ChangeUsernameValues) => {
        try {
            await updateUser({name: values.name});
            toast.success("Username updated!");
            onOpenChange(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update username.");
        }
    };

    return (
        <Modal open={open} onOpenChange={onOpenChange} labelledBy="change-username-title">
            <ModalHeader>Change Username</ModalHeader>

            <ModalBody>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <Input
                        label="New username"
                        placeholder="Enter new username"
                        error={errors.name?.message}
                        {...register("name")}
                        option="modal"
                    />

                    <ModalFooter>
                        <Button
                            buttonColor={BUTTON_COLOR.cancel}
                            buttonType={BUTTON_VARIANT.modal}
                            type="button"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            buttonColor={BUTTON_COLOR.orange}
                            buttonType={BUTTON_VARIANT.modal}
                            type="submit"
                            disabled={isSubmitting || isUpdating}
                        >
                            {isSubmitting || isUpdating ? <Spinner size={35}/> : "Save"}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalBody>
        </Modal>
    );
}
