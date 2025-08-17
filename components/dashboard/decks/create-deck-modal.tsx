"use client";
import React, {useState} from "react";
import Modal, {ModalBody, ModalFooter, ModalHeader} from "@/components/ui/modal/modal";
import Button, {BUTTON_COLOR} from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import ToggleGroup, {ToggleOption} from "@/components/ui/toggle/toggle-group";
import Switch from "@/components/ui/switch/switch";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const MODE_OPTIONS: ToggleOption[] = [
    {id: "normal", label: "Normal"},
    {id: "reversed", label: "Reversed"},
    {id: "typing", label: "Typing"},
];

export default function CreateDeckModal({open, onOpenChange}: Props) {
    const [selectedModes, setSelectedModes] = useState<string[]>(["normal"]);
    const [isPublic, setIsPublic] = useState(false);
    console.log(selectedModes);

    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <ModalHeader>Create new deck</ModalHeader>
            <ModalBody>
                <form action="" className="flex flex-col gap-3">
                    <div>
                        <Input label={"Deck name"} placeholder={"Enter deck name"}/>
                    </div>
                    <div>
                        <ToggleGroup
                            label={"Modes"}
                            options={MODE_OPTIONS}
                            value={selectedModes}
                            onChange={setSelectedModes}
                            minSelected={1}
                        />
                    </div>
                    <div>
                        <label style={{
                            display: "block",
                            fontSize: "20px",
                            color: "#333",
                            marginBottom: "8px",
                        }}>Visibility</label>
                        <Switch
                            label="Public"
                            checked={isPublic}
                            onChange={setIsPublic}
                        />
                    </div>
                </form>
            </ModalBody>
            <ModalFooter>
                <Button buttonColor={BUTTON_COLOR.orange} onClick={() => onOpenChange(false)}>Create</Button>
            </ModalFooter>
        </Modal>
    );
}
