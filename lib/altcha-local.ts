const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/** Hostname only (no port). */
export function isLocalhostHost(host: string | null | undefined): boolean {
  if (!host) return false;
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  return LOCAL_HOSTS.has(h);
}

export function isLocalhostClient(): boolean {
  if (typeof window === "undefined") return false;
  return isLocalhostHost(window.location.hostname);
}

export function isLocalhostRequest(request: Request): boolean {
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  return isLocalhostHost(host);
}
