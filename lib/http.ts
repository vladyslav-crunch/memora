// lib/http.ts
export async function getJSON<T>(url: string): Promise<T> {
    const res = await fetch(url, {credentials: "include"});
    if (!res.ok) {
        const err: any = {status: res.status};
        try {
            const body = await res.json();
            err.message = body?.error ?? `HTTP ${res.status}`;
            err.issues = body?.issues;
        } catch {
        }
        throw err;
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
        const err: any = {status: res.status};
        try {
            const body = await res.json();
            err.message = body?.error ?? `HTTP ${res.status}`;
            err.issues = body?.issues;
        } catch {
        }
        throw err;
    }
    return res.json() as Promise<T>;
}
