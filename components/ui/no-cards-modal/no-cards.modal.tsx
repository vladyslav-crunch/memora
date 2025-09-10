"use client";
import React from "react";
import {ConfirmModal} from "@/components/ui/confirm-modal/confirm-modal";

interface NoCardsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function NoCardsModal({isOpen, onClose, onConfirm}: NoCardsModalProps) {
    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="No cards to learn"
            message={`You have finished your learning session. (You can still proceed by clicking "Learn anyway", but it will not affect the interval days)`}
            confirmLabel="Learn anyway"
        />
    );
}
