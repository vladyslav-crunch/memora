"use client";
import styles from "./search-bar.module.css";
import {Search} from "lucide-react";
import {useDebouncedSearch} from "@/hooks/useDebouncedSearch";
import {useEffect} from "react";
import {usePathname} from "next/navigation";

export default function SearchBar() {
    const {value, setValue} = useDebouncedSearch();
    const pathname = usePathname();
    useEffect(() => {
        setValue("");
    }, [pathname, setValue]);
    return (
        <div className={styles.searchBarContainer}>
            <Search className={styles.searchBarIcon} strokeWidth={1}/>
            <input
                className={styles.searchBar}
                type="text"
                placeholder="Search..."
                name="search"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
}
