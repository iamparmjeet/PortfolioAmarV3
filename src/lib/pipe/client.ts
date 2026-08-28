// Typed fetch wrapper for Pipe public API used in client components.
// Server config (PIPE_PUBLIC_API_KEY) is never bundled; client reads via Next proxy
// or via server helpers (getPortfolioItems). This client is for optional TanStack hooks
// that hit the Next proxy at /api/pipe when present.
export const PIPE_CLIENT_BASE = "/api/pipe";

export async function pipeFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${PIPE_CLIENT_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Pipe request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}
