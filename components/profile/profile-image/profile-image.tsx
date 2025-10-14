"use client";
import React from "react";
import {CldImage, CldUploadWidget, CloudinaryUploadWidgetInfo} from "next-cloudinary";
import Image from "next/image";
import {Pencil} from "lucide-react";
import styles from './profile-image.module.css'

type Props = {
    imageUrl: string;
    onUpload: (url: string) => void;
    disabled?: boolean;
};

export default function ProfileImage({imageUrl, onUpload, disabled}: Props) {
    const handleUpload = (result: any) => {
        if (result && typeof result.info !== "string") {
            const info = result.info as CloudinaryUploadWidgetInfo;
            const newUrl = info.secure_url || info.url;
            onUpload(newUrl);
        }
    };

    return (
        <div className={styles.profileImage}>
            {imageUrl ? (
                imageUrl.includes("res.cloudinary.com") ? (
                    <CldImage src={imageUrl} width="128" height="128" crop="fill" alt="Profile Picture" priority/>
                ) : (
                    <Image src={imageUrl.replace(/=s\d+-c$/, "=s512-c")} width={128} height={128}
                           alt="Profile Picture"/>
                )
            ) : (
                <div className={styles.profileImage}>No Image</div>
            )}
            <CldUploadWidget
                uploadPreset="profile_picture"
                options={{folder: "profile_pictures", cropping: true, croppingAspectRatio: 1, sources: ["local"]}}
                onSuccess={handleUpload}
            >
                {({open}) => (
                    <button type="button" className={styles.changeImageHint} onClick={() => open()} disabled={disabled}>
                        <Pencil size={18}/>
                    </button>
                )}
            </CldUploadWidget>
        </div>
    );
}
