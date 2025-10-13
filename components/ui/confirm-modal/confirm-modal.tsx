import Modal, {ModalBody, ModalFooter, ModalHeader} from "@/components/ui/modal/modal";
import Button, {BUTTON_COLOR, BUTTON_VARIANT} from "@/components/ui/button/button";
import Spinner from "@/components/ui/spinner/spinner";
import {useState} from "react";


interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
                                                              isOpen,
                                                              onClose,
                                                              onConfirm,
                                                              message,
                                                              title,
                                                              confirmLabel = "Confirm",
                                                              cancelLabel = "Cancel",
                                                          }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();   // await the promise from parent
        } finally {
            setIsLoading(false);
            onClose();           // close modal after success/failure
        }
    };
    return (
        <Modal open={isOpen} onOpenChange={onClose}>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
                <p>{message}</p>
            </ModalBody>
            <ModalFooter>
                <Button buttonType={BUTTON_VARIANT.modal} buttonColor={BUTTON_COLOR.cancel} onClick={onClose}
                        disabled={isLoading}>
                    {cancelLabel}
                </Button>

                <Button buttonType={BUTTON_VARIANT.modal}
                        buttonColor={BUTTON_COLOR.red}
                        onClick={async () => {
                            await handleConfirm();
                            onClose();
                        }}
                        disabled={isLoading}
                >
                    {isLoading ? <Spinner size={35}/> : confirmLabel}
                </Button>
            </ModalFooter>
        </Modal>
    );
};
