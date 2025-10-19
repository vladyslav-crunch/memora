import React, {useEffect, useState} from 'react';
import {PublicDeck} from "@/lib/types/shared-deck.types";
import styles from './shared-deck.module.css'
import Image from "next/image";
import {CldImage} from "next-cloudinary";

type SharedDeckProps = {
    deck: PublicDeck;
}

function SharedDeck({deck}: SharedDeckProps) {
    const avatarPlaceHolder = "/avatar-placeholder.png"
    const [imageUrl, setImageUrl] = useState(avatarPlaceHolder);

    useEffect(() => {
        if (deck) {
            setImageUrl(deck.owner.image || avatarPlaceHolder);
        }
    }, [deck]);

    return (
        <div className={styles.deckContainer} onClick={() => {
        }}>
            <p className={styles.deckCount}>{deck.cardCount} cards</p>
            <p className={styles.deckName}>{deck.name}</p>
            <div className={styles.deckOwner}>
                {imageUrl && (
                    imageUrl.includes("res.cloudinary.com") ? (
                        <CldImage
                            src={imageUrl}
                            width="75"
                            height="75"
                            crop="fill"
                            alt="Profile Picture"
                            priority
                            className={styles.deckOwnerImage}
                        />
                    ) : (
                        <Image
                            src={imageUrl}
                            width={75}
                            height={75}
                            alt="Profile Picture"
                            priority
                            className={styles.deckOwnerImage}
                        />
                    )
                )}
                <p className={styles.deckOwnerName}>{deck.owner.name}</p>
            </div>
        </div>
    );
}

export default SharedDeck;
