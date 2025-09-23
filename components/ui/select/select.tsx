"use client";

import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from "@headlessui/react";
import {ChevronDown} from "lucide-react";
import React from "react";
import styles from "./select.module.css";

export type SelectOption<T> = {
    value: T;
    label: string;
    disabled?: boolean;
};

type SelectProps<T> = {
    options: SelectOption<T>[];
    value: T | null;
    onChange: (value: T) => void;
    placeholder?: string;
};

export function Select<T extends string | number>({
                                                      options,
                                                      value,
                                                      onChange,
                                                      placeholder = "-- Select --",
                                                  }: SelectProps<T>) {
    const selectedOption = options.find((o) => o.value === value) || null;

    return (
        <Listbox value={selectedOption} onChange={(opt) => opt && onChange(opt.value)}>
            <div className="relative">
                <ListboxButton className={styles.listboxButton}>
                    {selectedOption ? selectedOption.label : placeholder}
                    <ChevronDown className="w-4 h-4 opacity-50"/>
                </ListboxButton>

                <ListboxOptions className={styles.listboxOptions}>
                    {options.map((opt) => (
                        <ListboxOption
                            key={opt.value}
                            value={opt}
                            disabled={opt.disabled}
                            className={({selected, disabled}) =>
                                [
                                    styles.listboxOption,
                                    selected ? styles.listboxOptionSelected : "",
                                    disabled ? styles.listboxOptionDisabled : "",
                                ].join(" ")
                            }
                        >
                            {opt.label}
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    );
}
