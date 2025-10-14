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

const ChangePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(6, "New password must be at least 6 characters long")
            .max(100, "Password too long"),
        confirmPassword: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type ChangePasswordValues = z.infer<typeof ChangePasswordSchema>;

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function ChangePasswordModal({open, onOpenChange}: Props) {
    const {changePassword, isChangingPassword} = useUser();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: {errors, isSubmitting},
    } = useForm<ChangePasswordValues>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        }
    }, [open, reset]);

    const onSubmit = async (values: ChangePasswordValues) => {
        try {
            await changePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            });
            toast.success("Password changed successfully!");
            onOpenChange(false);
        } catch (err: any) {
            console.log(err);
            if (err?.status === 400 && err?.message) {
                setError("currentPassword", {message: err.message});
            } else {
                toast.error("Failed to change password.");
            }
        }
    };

    return (
        <Modal open={open} onOpenChange={onOpenChange} labelledBy="change-password-title">
            <ModalHeader>Change Password</ModalHeader>

            <ModalBody>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <Input
                        label="Current Password"
                        type="password"
                        placeholder="Enter current password"
                        error={errors.currentPassword?.message}
                        {...register("currentPassword")}
                        option="modal"
                    />

                    <Input
                        label="New Password"
                        type="password"
                        placeholder="Enter new password"
                        error={errors.newPassword?.message}
                        {...register("newPassword")}
                        option="modal"
                    />

                    <Input
                        label="Confirm New Password"
                        type="password"
                        placeholder="Re-enter new password"
                        error={errors.confirmPassword?.message}
                        {...register("confirmPassword")}
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
                            {isSubmitting || isChangingPassword ? <Spinner size={35}/> : "Change"}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalBody>
        </Modal>
    );
}
