import React from 'react';
import styles from './app-background.module.css'

function AppBackground() {
    return (
        <>
            <div className={styles.redCircle}></div>
            <div className={styles.blueCircle}></div>
            <div className={styles.yellowCircle}></div>
            <div className={styles.blueCircle2}></div>
            <div className={styles.redCircle2}></div>
        </>
    );
}

export default AppBackground;