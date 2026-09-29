// Google Ads da Start Cont — tag global (gtag.js) e conversão de contato.

export const GOOGLE_ADS_ID = "AW-18481331615";

/** Ação de conversão "Contato" (formulário ou clique no WhatsApp). */
const CONVERSAO_CONTATO = `${GOOGLE_ADS_ID}/72XZCPDW44kdEJ_7yuxE`;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function registrarConversaoContato() {
  window.gtag?.("event", "conversion", { send_to: CONVERSAO_CONTATO });
}
