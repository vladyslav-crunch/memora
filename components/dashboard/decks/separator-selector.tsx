import React from "react";

type SeparatorSelectorProps = {
    fieldSeparator: "tab" | "comma";
    rowSeparator: "semicolon" | "newline";
    onFieldChange: (value: "tab" | "comma") => void;
    onRowChange: (value: "semicolon" | "newline") => void;
};

export function SeparatorSelector({
                                      fieldSeparator,
                                      rowSeparator,
                                      onFieldChange,
                                      onRowChange,
                                  }: SeparatorSelectorProps) {
    const fieldOptions: Array<"tab" | "comma"> = ["tab", "comma"];
    const rowOptions: Array<"semicolon" | "newline"> = ["semicolon", "newline"];

    return (
        <div className="flex flex-col gap-4">
            {/* Field separator */}
            <div>
                <label className="block text-lg mb-2 text-gray-700">Between fields</label>
                <div className="flex gap-3">
                    {fieldOptions.map((option) => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="fieldSeparator"
                                value={option}
                                checked={fieldSeparator === option}
                                onChange={() => onFieldChange(option)}
                            />
                            <span className="capitalize">{option}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Row separator */}
            <div>
                <label className="block text-lg mb-2 text-gray-700">Between rows</label>
                <div className="flex gap-3">
                    {rowOptions.map((option) => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="rowSeparator"
                                value={option}
                                checked={rowSeparator === option}
                                onChange={() => onRowChange(option)}
                            />
                            <span className="capitalize">
                {option === "semicolon" ? "Semicolon (;)" : "New line (↵)"}
              </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
