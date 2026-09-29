"use client";

import { useEffect } from "react";
import { registrarConversaoContato } from "@/lib/googleAds";

/**
 * Conta como conversão do Google Ads qualquer clique num link do WhatsApp do
 * site público. Portal e painel ficam de fora — ali já é cliente.
 */
export function ConversaoWhatsApp() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest?.('a[href^="https://wa.me/"]');
      if (!link) return;
      if (/^\/(portal|admin)(\/|$)/.test(window.location.pathname)) return;
      registrarConversaoContato();
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
