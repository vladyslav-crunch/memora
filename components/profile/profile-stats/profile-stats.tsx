import React from 'react';
import {useUser} from "@/hooks/useUser";
import styles from './profile-stats.module.css'
import {daysSince} from "@/lib/utility/daysSince";

function ProfileStats() {
    const {stats, user} = useUser();
    return (
        <div className={styles.statsContainer}>
            <div className={styles.statsItem}>
                <p>{daysSince(user?.createdAt as string)}</p>
                <p>days</p>
            </div>
            <div className={styles.statsItem}>
                <p>{stats?.totalDecks}</p>
                <p>decks</p>
            </div>
            <div className={styles.statsItem}>
                <p>{stats?.totalCards}</p>
                <p>cards</p>
            </div>
        </div>
    );
}

export default ProfileStats;