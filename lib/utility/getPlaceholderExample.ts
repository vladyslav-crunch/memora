import {getSeparator} from "@/lib/utility/getSeparator";

export const getPlaceholderExample = (fieldSeparator: "tab" | "comma", rowSeparator: "semicolon" | "newline"): string => {
    const fieldSep = getSeparator(fieldSeparator);
    const rowSep = getSeparator(rowSeparator);

    const sampleCards = [
        ["Front1", "Back1", "Context1"],
        ["Front2", "Back2", "Context2"],
        ["Front3", "Back3", "Context3"],
    ];

    return sampleCards.map(row => row.join(fieldSep)).join(rowSep);
};
