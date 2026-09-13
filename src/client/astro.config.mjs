// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import umbracoSignalR from "./src/integrations/umbraco-signalr";

// https://astro.build/config
export default defineConfig({
  site: "https://cncsolutions.be",
  image: {
    domains: ["cncsolutions-backend.azurewebsites.net"],
  },
  integrations: [sitemap(), umbracoSignalR()],
  vite: {
    plugins: [tailwindcss()],
  },
});
