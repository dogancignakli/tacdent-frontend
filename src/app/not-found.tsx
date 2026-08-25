import type { Metadata } from "next";

/**
 * Root not-found. Root layout only returns `children`, so this page must
 * provide its own document shell.
 */
export const metadata: Metadata = {
  title: "Sayfa bulunamadı | Page not found",
  robots: { index: false, follow: false },
};

export default function RootNotFound() {
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
          <h1 style={{ fontSize: 24, margin: "0 0 8px" }}>Sayfa bulunamadı</h1>
          <p style={{ margin: "0 0 4px", color: "#525252" }}>Page not found</p>
          <p style={{ margin: "0 0 24px", color: "#737373", fontSize: 14 }}>
            Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="/tr"
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                background: "#171717",
                color: "#fff",
                textDecoration: "none",
              }}
            >
              Ana sayfa
            </a>
            <a
              href="/tr/services"
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid #d4d4d4",
                background: "#fff",
                color: "#171717",
                textDecoration: "none",
              }}
            >
              Hizmetler
            </a>
            <a
              href="/tr/contact"
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid #d4d4d4",
                background: "#fff",
                color: "#171717",
                textDecoration: "none",
              }}
            >
              İletişim
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
