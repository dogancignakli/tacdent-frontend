"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary. Must own its own <html>/<body> and must not depend on
 * the locale layout, theme provider, or next-intl.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#fafafa",
          color: "#171717",
        }}
      >
        <div style={{ maxWidth: 420, padding: 24, textAlign: "center" }}>
          <h1 style={{ fontSize: 24, margin: "0 0 8px" }}>Sayfa yüklenemedi</h1>
          <p style={{ margin: "0 0 4px", color: "#525252" }}>
            This page couldn’t load.
          </p>
          <p style={{ margin: "0 0 24px", color: "#737373", fontSize: 14 }}>
            Beklenmeyen bir hata oluştu. / An unexpected error occurred.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                background: "#171717",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Tekrar dene / Try again
            </button>
            <a
              href="/tr"
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid #d4d4d4",
                background: "#fff",
                color: "#171717",
                textDecoration: "none",
              }}
            >
              Ana sayfa / Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
