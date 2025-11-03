import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import styles from "../../card-list/card-list-header/card-list-header.module.css";
import { useRouter } from "next/navigation";
import { PublicDeckResponse } from "@/lib/types/shared-deck.types";
import { CldImage } from "next-cloudinary";
import Image from "next/image";

type CardListHeaderProps = {
  deck: PublicDeckResponse;
};

function SharedCardListHeader({ deck }: CardListHeaderProps) {
  const router = useRouter();
  const avatarPlaceHolder = "/avatar-placeholder.png";
  const [imageUrl, setImageUrl] = useState(avatarPlaceHolder);
  useEffect(() => {
    if (deck) {
      setImageUrl(deck.owner.image || avatarPlaceHolder);
    }
  }, [deck]);

  console.log(deck);
  return (
    <div className={styles.cardListHeaderContainer}>
      <p className={styles.cardListHeaderTitle}>
        <ArrowLeft
          size={30}
          onClick={() => router.back()}
          className={`${styles.icon} ${styles.noShrink} cursor-pointer`}
        />
        <span className={styles.deckName}>{deck?.name}</span>
      </p>
      <div className={styles.cardListHeaderOwner}>
        <p>
          Created by: <span>{deck.owner.name}</span>
        </p>
        {imageUrl &&
          (imageUrl.includes("res.cloudinary.com") ? (
            <CldImage
              src={imageUrl}
              width="75"
              height="75"
              crop="fill"
              alt="Profile Picture"
              priority
              className={styles.cardListHeaderImage}
            />
          ) : (
            <Image
              src={imageUrl}
              width={75}
              height={75}
              alt="Profile Picture"
              priority
              className={styles.cardListHeaderImage}
            />
          ))}
      </div>
    </div>
  );
}

export default SharedCardListHeader;
