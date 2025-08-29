"use client";
import React, {PropsWithChildren, createContext, useContext, useEffect, useRef} from "react";
import {createPortal} from "react-dom";
import styles from "./modal.module.css";
import {X} from "lucide-react";
import {motion, AnimatePresence, Variants} from "framer-motion";

// modal animation
const modalVariants: Variants = {
    hidden: {opacity: 0, scale: 0.95},
    visible: {opacity: 1, scale: 1, transition: {duration: 0.2, ease: "easeOut"}},
    exit: {opacity: 0, scale: 0.95, transition: {duration: 0.15, ease: "easeIn"}},
};

// backdrop animation
const backdropVariants: Variants = {
    hidden: {opacity: 0},
    visible: {opacity: 1, transition: {duration: 0.2}},
    exit: {opacity: 0, transition: {duration: 0.15}},
};

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

    useEffect(() => {
        if (open) {
            const firstInput = modalRef.current?.querySelector<HTMLInputElement>("input");
            firstInput?.focus();
        }
    }, [open]);

    // Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        if (open) document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [open]);

    return createPortal(
        <ModalCtx.Provider value={{close}}>
            <AnimatePresence>
                {open && (
                    <motion.div
                        className={styles.dialog}
                        aria-labelledby={labelledBy}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={backdropVariants} // <-- backdrop animation
                        onMouseDown={(e) => {
                            if (closeOnBackdrop && modalRef.current && !modalRef.current.contains(e.target as Node)) {
                                close();
                            }
                        }}
                    >
                        <motion.div
                            ref={modalRef}
                            className={`${styles.modal} ${styles[variant ?? "default"]}`}
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {children}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ModalCtx.Provider>,
        document.body
    );
}

export function ModalHeader({children}: PropsWithChildren<object>) {
    const {close} = useModal();
    return (
        <div className={styles.header}>
            <h2 className={styles.title}>{children}</h2>
            <button type="button" className={styles.closeBtn} onClick={close} aria-label="Close">
                <X size={25}/>
            </button>
        </div>
    );
}

export function ModalBody({children}: PropsWithChildren<object>) {
    return <div className={styles.body}>{children}</div>;
}

export function ModalFooter({children}: PropsWithChildren<object>) {
    return <div className={styles.footer}>{children}</div>;
}
