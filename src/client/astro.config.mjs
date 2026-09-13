// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import umbracoSignalR from "./src/integrations/umbraco-signalr";

// https://astro.build/config
export default defineConfig({
  // Astro 7 defaults to JSX-style whitespace, which strips the spaces around
  // inline text and shifts inline layout. Keep the HTML-aware behaviour.
  compressHTML: true,
  image: {
    domains: ["cncsolutions-backend.azurewebsites.net"],
  },
  integrations: [umbracoSignalR()],
  vite: {
    plugins: [tailwindcss()],
  },
});
