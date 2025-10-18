"use client";

import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {getJSON, sendJSON} from "@/lib/http";
import {UserMeResponse, UserProfile} from "@/lib/types/user.types";

export const userKey = ["user", "me"] as const;


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
        mutationFn: (body: { currentPassword?: string; newPassword: string }) =>
            sendJSON("/api/user/me/password-change", {method: "PATCH", body}),
        onSuccess: () => {
            qc.removeQueries({queryKey: userKey});
        },
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
