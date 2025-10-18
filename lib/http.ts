import {ApiError, ApiErrorResponse} from "@/lib/types/api";

async function fetchJSON<T>(
    input: RequestInfo,
    init?: Omit<RequestInit, "body"> & { body?: unknown }
): Promise<T> {
    const res = await fetch(input, {
        credentials: "include",
        headers: {"Content-Type": "application/json", ...(init?.headers ?? {})},
        ...init,
        body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
    });

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

        throw new ApiError(errorData.status, errorData.message, errorData.errors);
    }

    return (await res.json()) as T;
}

//GET wrapper
export async function getJSON<T>(url: string): Promise<T> {
    return fetchJSON<T>(url, {method: "GET"});
}

//POST/PUT/PATCH/DELETE wrapper

export async function sendJSON<T>(
    url: string,
    init: Omit<RequestInit, "body"> & { body?: unknown }
): Promise<T> {
    return fetchJSON<T>(url, init);
}
