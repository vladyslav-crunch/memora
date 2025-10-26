import React from 'react';
import styles from '../../card-list/card-list-table/card-list-table.module.css'
import {PublicCard, PublicCardListResponse} from "@/lib/types/shared-cards.types";

type SharedCardListTableProps = {
    cards: PublicCardListResponse;
}

function SharedCardListTable({cards}: SharedCardListTableProps) {
    return (
        <div className={styles.cardTableContainer}>
            <table className={styles.table}>
                <colgroup>
                    <col style={{width: "33%"}}/>
                    <col style={{width: "33%"}}/>
                    <col style={{width: "33%"}}/>
                </colgroup>
                <thead className={styles.thead}>
                <tr>
                    <th className={styles.th}>Front</th>
                    <th className={styles.th} style={{textAlign: "center"}}>Back</th>
                    <th className={styles.th}>Context</th>
                </tr>
                </thead>
                <tbody>
                {cards.items.map((card: PublicCard) => {
                    return (
                        <tr
                            key={card.id}
                            className={`${styles.tr}`}
                        >
                            <td className={styles.td}>
                                <p className={styles.cardFront}>{card.front}</p>
                            </td>
                            <td className={styles.td}>
                                <p className={styles.cardBack} style={{textAlign: "center"}}>{card.back}</p>
                            </td>
                            <td className={styles.td}>
                                <p className={styles.cardContext}>{card.context}</p>
                            </td>

                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    )
}

export default SharedCardListTable;