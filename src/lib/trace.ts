const SESSION_COOKIE_NAME = "tacdent_sid";

/**
 * Returns a stable session id for the current browser session (session cookie).
 * On the server (SSR/RSC) returns a fresh ephemeral id — there is no shared cookie jar.
 */
export function getSessionId(): string {
  if (typeof document === "undefined") {
    return crypto.randomUUID();
  }

  const existing = readCookie(SESSION_COOKIE_NAME);
  if (existing) {
    return existing;
  }

  const sessionId = crypto.randomUUID();
  document.cookie = `${SESSION_COOKIE_NAME}=${encodeURIComponent(sessionId)}; Path=/; SameSite=Lax`;
  return sessionId;
}

/** Fresh correlation id for a single outbound request. */
export function newCorrelationId(): string {
  return crypto.randomUUID();
}

export function buildClientTraceHeaders(): Record<string, string> {
  return {
    "X-Session-Id": getSessionId(),
    "X-Correlation-ID": newCorrelationId(),
  };
}

function readCookie(name: string): string | null {
  const prefix = `${name}=`;
  const parts = document.cookie.split("; ");
  for (const part of parts) {
    if (part.startsWith(prefix)) {
      return decodeURIComponent(part.slice(prefix.length));
    }
  }
  return null;
}
