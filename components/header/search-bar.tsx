import styles from './search-bar.module.css'
import {Search} from "lucide-react";

export default function SearchBar() {
    return (
        <div className={styles.searchBarContainer}>
            <Search className={styles.searchBarIcon} strokeWidth={1}/>
            <input
                className={styles.searchBar}
                type="text"
                placeholder="Search..."
                name="search"
            />
        </div>
    );
}