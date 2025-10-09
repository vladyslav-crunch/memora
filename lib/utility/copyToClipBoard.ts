import {toast} from "sonner";

export const copyToClipBoard = async (text: string) => {
    if (!text.trim()) {
        toast.error("Nothing to copy.");
        return;
    }
    try {
        await navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    } catch (error) {
        console.error(error);
        toast.error("Failed to copy text.");
    }
};