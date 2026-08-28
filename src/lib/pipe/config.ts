// Pipe pipeline config — server-only helpers.
// PIPE_API_URL is the Worker base (e.g. https://pipe.<account>.workers.dev)
// PIPE_PUBLIC_API_KEY is a read-scope key; never expose as NEXT_PUBLIC.
export function getPipeConfig() {
  const url = process.env.PIPE_API_URL?.trim();
  const key = process.env.PIPE_PUBLIC_API_KEY?.trim();
  return {
    url: url && url.length > 0 ? url.replace(/\/$/, "") : undefined,
    key: key && key.length > 0 ? key : undefined,
    isConfigured: Boolean(url && key),
  };
}
