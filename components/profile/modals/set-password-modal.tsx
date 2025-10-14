"use client";

import React, {useEffect} from "react";
import Modal, {ModalBody, ModalFooter, ModalHeader} from "@/components/ui/modal/modal";
import Button, {BUTTON_COLOR, BUTTON_VARIANT} from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import Spinner from "@/components/ui/spinner/spinner";
import {toast} from "sonner";
import {useUser} from "@/hooks/useUser";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

const SetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(6, "New password must be at least 6 characters long")
            .max(100, "Password too long"),
    });

type ChangePasswordValues = z.infer<typeof SetPasswordSchema>;

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function SetPasswordModal({open, onOpenChange}: Props) {
    const {changePassword, isChangingPassword} = useUser();

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<ChangePasswordValues>({
        resolver: zodResolver(SetPasswordSchema),
        defaultValues: {
            newPassword: "",
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                newPassword: "",
            });
        }
    }, [open, reset]);

    const onSubmit = async (values: ChangePasswordValues) => {
        try {
            await changePassword({
                newPassword: values.newPassword,
            });
            toast.success("Password changed successfully!");
            onOpenChange(false);
        } catch {
            toast.error("Failed to set password.");
        }
    };

    return (
        <Modal open={open} onOpenChange={onOpenChange} labelledBy="change-password-title">
            <ModalHeader>Set Password</ModalHeader>

            <ModalBody>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

                    <Input
                        label="New Password"
                        type="password"
                        placeholder="Enter new password"
                        error={errors.newPassword?.message}
                        {...register("newPassword")}
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
                            disabled={isSubmitting || isChangingPassword}
                        >
                            {isSubmitting || isChangingPassword ? <Spinner size={35}/> : "Set"}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalBody>
        </Modal>
    );
}
