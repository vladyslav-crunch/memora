"use client";
import React, {useEffect, useState} from "react";
import Modal, {ModalBody, ModalFooter, ModalHeader} from "@/components/ui/modal/modal";

import Button, {BUTTON_COLOR, BUTTON_VARIANT} from "@/components/ui/button/button";


type SortBy = "intervalStrength" | "nextRepetitionTime" | "createdAt";
type SortOrder = "asc" | "desc";

interface SortCardsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onApply: (sortBy: SortBy, sortOrder: SortOrder) => void;
    initialSort?: { sortBy?: SortBy; sortOrder?: SortOrder };
}

const sortFields: { value: SortBy; label: string }[] = [
    {value: "intervalStrength", label: "Interval Strength"},
    {value: "nextRepetitionTime", label: "Next Repetition"},
    {value: "createdAt", label: "Created At"},
];

export default function SortCardsModal({
                                           open,
                                           onOpenChange,
                                           onApply,
                                           initialSort,
                                       }: SortCardsModalProps) {
    const [sortBy, setSortBy] = useState<SortBy>("createdAt");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

    useEffect(() => {
        if (initialSort?.sortBy) setSortBy(initialSort.sortBy);
        if (initialSort?.sortOrder) setSortOrder(initialSort.sortOrder);
    }, [initialSort, open]);

    const handleApply = () => {
        onApply(sortBy, sortOrder);
        onOpenChange(false);
    };

    return (
        <Modal open={open} onOpenChange={onOpenChange} labelledBy="sort-cards-title">
            <ModalHeader>Sort cards</ModalHeader>
            <ModalBody>
                <div className="flex flex-col gap-6">
                    {/* Sort By */}
                    <div>
                        <p className="block text-lg mb-2 text-gray-700">Sort by</p>
                        <div className="flex flex-col gap-2">
                            {sortFields.map((field) => (
                                <label key={field.value} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="sortBy"
                                        value={field.value}
                                        checked={sortBy === field.value}
                                        onChange={() => setSortBy(field.value)}
                                        className="accent-blue-600"
                                    />
                                    <span className="text-sm">{field.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Sort Order */}
                    <div>
                        <p className="block text-lg mb-2 text-gray-700">Order</p>
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sortOrder"
                                    value="asc"
                                    checked={sortOrder === "asc"}
                                    onChange={() => setSortOrder("asc")}
                                    className="accent-blue-600"
                                />
                                <span className="text-sm">Ascending</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sortOrder"
                                    value="desc"
                                    checked={sortOrder === "desc"}
                                    onChange={() => setSortOrder("desc")}
                                    className="accent-blue-600"
                                />
                                <span className="text-sm">Descending</span>
                            </label>
                        </div>
                    </div>
                </div>
            </ModalBody>

            <ModalFooter>
                <div className="flex justify-end gap-3 w-full">
                    <Button buttonType={BUTTON_VARIANT.modal} buttonColor={BUTTON_COLOR.cancel}
                            onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button buttonType={BUTTON_VARIANT.modal} buttonColor={BUTTON_COLOR.orange}
                            onClick={handleApply}>Apply</Button>
                </div>
            </ModalFooter>
        </Modal>
    );
}
