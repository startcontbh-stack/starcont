import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.nomeCompleto,
    short_name: site.nome,
    description: site.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#0b1530",
    theme_color: "#0b1530",
    lang: "pt-BR",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
