"use client";
import React, {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useRef,
} from "react";
import {createPortal} from "react-dom";
import styles from "./modal.module.css";
import {X} from "lucide-react";

type ModalContextValue = { close: () => void };
const ModalCtx = createContext<ModalContextValue | null>(null);

export function useModal() {
    const ctx = useContext(ModalCtx);
    if (!ctx) throw new Error("useModal must be used inside Modal");
    return ctx;
}

type Props = {
    open: boolean;
    onOpenChange: (o: boolean) => void;
    labelledBy?: string;
    closeOnBackdrop?: boolean;
    variant?: "default" | "compact";
};

export default function Modal({
                                  open,
                                  onOpenChange,
                                  labelledBy,
                                  closeOnBackdrop = true,
                                  variant = "default",
                                  children,
                              }: PropsWithChildren<Props>) {
    const modalRef = useRef<HTMLDivElement>(null);

    const close = () => onOpenChange(false);

    // auto-focus first input when opened
    useEffect(() => {
        if (open) {
            const firstInput = modalRef.current?.querySelector<HTMLInputElement>("input");
            firstInput?.focus();
        }
    }, [open]);

    // backdrop click
    useEffect(() => {
        if (!closeOnBackdrop || !modalRef.current) return;

        const handleClick = (e: MouseEvent) => {
            if (!modalRef.current) return;
            if (!modalRef.current.contains(e.target as Node)) {
                close();
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [closeOnBackdrop]);

    if (!open) return null;

    return createPortal(
        <ModalCtx.Provider value={{close}}>
            <div
                className={styles.dialog}
                aria-labelledby={labelledBy}
                onMouseDown={(e) => {
                    // If click is outside modal content, close
                    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                        close();
                    }
                }}
            >
                <div
                    ref={modalRef}
                    className={`${styles.modal} ${styles[variant ?? "default"]}`}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") close();
                    }}
                >
                    {children}
                </div>
            </div>
        </ModalCtx.Provider>,
        document.body
    );

}

export function ModalHeader({children}: PropsWithChildren<{}>) {
    const {close} = useModal();
    return (
        <div className={styles.header}>
            <h2 className={styles.title}>{children}</h2>
            <button
                type="button"
                className={styles.closeBtn}
                onClick={close}
                aria-label="Close"
            >
                <X size={25}/>
            </button>
        </div>
    );
}

export function ModalBody({children}: PropsWithChildren<{}>) {
    return <div className={styles.body}>{children}</div>;
}

export function ModalFooter({children}: PropsWithChildren<{}>) {
    return <div className={styles.footer}>{children}</div>;
}
