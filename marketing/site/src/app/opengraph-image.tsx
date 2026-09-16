import { ImageResponse } from "next/og";

// Imagem padrão de compartilhamento (WhatsApp, Instagram, LinkedIn, Google).
// Gerada no build com as cores e o símbolo da Start Cont.
export const alt = "Start Cont — Assessoria Contábil em Belo Horizonte";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          background: "linear-gradient(135deg, #0b1530 0%, #050a1a 100%)",
          color: "#ffffff",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* arcos vermelhos da marca */}
        <div
          style={{
            position: "absolute",
            right: -220,
            top: -300,
            width: 640,
            height: 640,
            borderRadius: 9999,
            border: "3px solid rgba(255,43,58,0.65)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -260,
            bottom: -420,
            width: 700,
            height: 700,
            borderRadius: 9999,
            border: "3px solid rgba(255,43,58,0.45)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <svg width="150" height="150" viewBox="0 0 48 48">
            <defs>
              <linearGradient id="t" x1="0" y1="0.5" x2="1" y2="0.5">
                <stop offset="0" stopColor="#7d0c1a" />
                <stop offset="1" stopColor="#ff2b3a" />
              </linearGradient>
            </defs>
            <circle cx="24" cy="24" r="21" fill="none" stroke="#e3162a" strokeWidth="2.6" />
            <path
              d="M19.2 15.6 33.4 24l-14.2 8.4Z"
              fill="url(#t)"
              stroke="#e3162a"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ width: 3, height: 150, background: "#d0142c" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 104, fontWeight: 700, lineHeight: 1 }}>
              <span>Start</span>
              <span style={{ color: "#ff2b3a", marginLeft: 26 }}>Cont</span>
            </div>
            <div style={{ fontSize: 30, letterSpacing: 14, marginTop: 18 }}>
              ASSESSORIA CONTÁBIL
            </div>
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 36, marginTop: 70, color: "#e5e8f0" }}>
          Contabilidade em Belo Horizonte · atendimento em todo o Brasil
        </div>
        <div style={{ display: "flex", fontSize: 26, marginTop: 18, color: "#ff5a66", letterSpacing: 6 }}>
          PROXIMIDADE · CONFIANÇA · INOVAÇÃO · RESULTADOS
        </div>
      </div>
    ),
    size
  );
}
