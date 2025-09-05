// hooks/useProgressionHistory.ts
"use client";
import {useQuery} from "@tanstack/react-query";
import {getJSON} from "@/lib/http";

export type ProgressionHistory = {
    createdAt: string;
    highIndicationCount: number;
    midIndicationCount: number;
    lowIndicationCount: number;
    veryLowIndicationCount: number;
};

export function useProgressionHistory() {
    return useQuery({
        queryKey: ["progressionHistory"],
        queryFn: () => getJSON<ProgressionHistory[]>("/api/history"),
    });
}
