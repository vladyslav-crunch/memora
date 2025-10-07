"use client";

import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {getJSON, sendJSON} from "@/lib/http";

export const userKey = ["user", "me"] as const;

export type UserProfile = {
    id: string;
    name: string;
    email: string;
    image?: string;
    createdAt: string;
};

export type UserStats = {
    totalDecks: number;
    totalCards: number;
};

export type UserMeResponse = {
    user: UserProfile;
    stats: UserStats;
};

export function useUser() {
    const qc = useQueryClient();

    const userQuery = useQuery<UserMeResponse>({
        queryKey: userKey,
        queryFn: () => getJSON<UserMeResponse>("/api/user/me"),
    });

    const updateUser = useMutation({
        mutationFn: (body: Partial<{ name: string; email: string; image: string }>) =>
            sendJSON<UserProfile>("/api/user/me", {method: "PUT", body}),
        onSuccess: (data) => {
            qc.setQueryData(userKey, {user: data, stats: userQuery.data?.stats});
        },
    });

    const changePassword = useMutation({
        mutationFn: (body: { currentPassword: string; newPassword: string }) =>
            sendJSON("/api/user/me/password-reset", {method: "PATCH", body}),
    });

    const deleteUser = useMutation({
        mutationFn: () => sendJSON("/api/user/me", {method: "DELETE"}),
        onSuccess: () => {
            qc.removeQueries({queryKey: userKey});
        },
    });

    return {
        user: userQuery.data?.user,
        stats: userQuery.data?.stats,
        isLoading: userQuery.isLoading,
        isError: userQuery.isError,

        updateUser: updateUser.mutateAsync,
        isUpdating: updateUser.isPending,

        changePassword: changePassword.mutateAsync,
        isChangingPassword: changePassword.isPending,

        deleteUser: deleteUser.mutateAsync,
        isDeleting: deleteUser.isPending,
    };
}
