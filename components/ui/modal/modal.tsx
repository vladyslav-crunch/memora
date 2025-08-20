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
    if (!ctx) throw new Error("useModal must be used inside <Modal>");
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
    const ref = useRef<HTMLDialogElement>(null);

    // keep <dialog> open state in sync
    useEffect(() => {
        const d = ref.current;
        if (!d) return;
        if (open && !d.open) d.showModal();
        if (!open && d.open) d.close();
    }, [open]);

    const close = () => onOpenChange(false);

    // ESC/cancel
    const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
        e.preventDefault();
        close();
    };

    // backdrop click
    useEffect(() => {
        if (!closeOnBackdrop) return;
        const d = ref.current;
        if (!d) return;

        const onClick = (e: MouseEvent) => {
            const r = d.getBoundingClientRect();
            const inside =
                e.clientX >= r.left &&
                e.clientX <= r.right &&
                e.clientY >= r.top &&
                e.clientY <= r.bottom;
            if (!inside) close();
        };

        d.addEventListener("click", onClick);
        return () => d.removeEventListener("click", onClick);
    }, [closeOnBackdrop]);

    if (typeof window === "undefined") return null; // avoid SSR mismatch

    return createPortal(
        <ModalCtx.Provider value={{close}}>
            <dialog
                ref={ref}
                className={`${styles.dialog} `}
                aria-labelledby={labelledBy}
                onCancel={handleCancel}
            >
                <div className={`${styles.modal} ${styles[variant ?? "default"]}`}>{children}</div>
            </dialog>
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
