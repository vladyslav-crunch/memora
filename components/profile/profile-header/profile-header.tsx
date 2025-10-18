import React from "react";
import {Pencil} from "lucide-react";
import ProfileImage from "@/components/profile/profile-image/profile-image";
import styles from './profile-header.module.css'
import ProfileStats from "@/components/profile/profile-stats/profile-stats";

type Props = {
    name: string;
    email: string;
    imageUrl: string;
    onNameEdit: () => void;
    onImageUpload: (url: string) => void;
    isUpdating?: boolean;
};

export default function ProfileHeader({name, email, imageUrl, onNameEdit, onImageUpload, isUpdating}: Props) {
    return (
        <div className={styles.profileHeader}>
            <ProfileImage imageUrl={imageUrl} onUpload={onImageUpload} disabled={isUpdating}/>
            <div className={styles.profileUserInfo}>
                <p id={styles.userName}>
                    {name} <Pencil size={15} strokeWidth={"2.5px"} className="cursor-pointer" onClick={onNameEdit}/>
                </p>
                <p id={styles.userEmail}>{email}</p>
                <ProfileStats/>
            </div>
        </div>
    );
}
