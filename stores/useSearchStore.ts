import {create} from "zustand";

interface SearchState {
    value: string;            // current text input value
    debouncedValue: string;   // value used for API calls
    setValue: (val: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
    value: "",
    debouncedValue: "",
    setValue: (val) => set({value: val}),
}));
