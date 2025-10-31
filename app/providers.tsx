"use client";
import {Toaster} from "sonner";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactNode, useState} from "react";

export default function Providers({children}: { children: ReactNode }) {
    const [qc] = useState(() => new QueryClient());
    return (
        <QueryClientProvider client={qc}>
            {children}
            <Toaster position="bottom-right"/>
        </QueryClientProvider>
    )
}