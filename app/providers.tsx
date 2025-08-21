"use client";
import {Toaster} from "sonner";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useState} from "react";

export default function Providers({children}: { children: React.ReactNode }) {
    const [qc] = useState(() => new QueryClient());
    return (
        <QueryClientProvider client={qc}>
            {children}
            <Toaster position="bottom-right"/>
        </QueryClientProvider>
    )
}