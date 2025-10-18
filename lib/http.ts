import {ApiErrorResponse} from "@/lib/types/api";

export async function getJSON<T>(url: string): Promise<T> {
    const res = await fetch(url, {credentials: "include"});

    if (!res.ok) {
        let errorData: ApiErrorResponse = {status: res.status};

        try {
            const body = await res.json();
            errorData = {
                ...errorData,
                message: body?.error ?? body?.message ?? `HTTP ${res.status}`,
                errors: Array.isArray(body?.errors) ? body.errors : undefined,
            };
        } catch {
            errorData.message = `HTTP ${res.status}`;
        }

        throw errorData;
    }

    return await res.json() as Promise<T>;
}

export async function sendJSON<T>(
    url: string,
    init: Omit<RequestInit, "body"> & { body?: unknown }
): Promise<T> {
    const res = await fetch(url, {
        credentials: "include",
        headers: {"Content-Type": "application/json", ...(init.headers ?? {})},
        ...init,
        body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    });

    if (!res.ok) {
        let errorData: ApiErrorResponse = {status: res.status};
        try {
            const body = await res.json();
            errorData = {
                ...errorData,
                message: body?.error ?? body?.message,
                errors: body?.errors,
            };
        } catch {
        }
        throw errorData;
    }
    return await res.json() as Promise<T>;
}
