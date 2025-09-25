// hooks/useDebouncedSearch.ts
import {useEffect} from "react";
import {useSearchStore} from "@/stores/useSearchStore";

export function useDebouncedSearch(delay = 300) {
    const value = useSearchStore((s) => s.value);
    const setValue = useSearchStore((s) => s.setValue);
    const debouncedValue = useSearchStore((s) => s.debouncedValue);
    
    useEffect(() => {
        const handler = setTimeout(() => {
            useSearchStore.setState({debouncedValue: value});
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return {value, debouncedValue, setValue};
}
