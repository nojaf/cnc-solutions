// @ts-check
import { defineConfig } from 'astro/config';
import umbracoSignalR from './src/integrations/umbraco-signalr';

// https://astro.build/config
export default defineConfig({
  image: {
    domains: ["cncsolutions-backend.azurewebsites.net"],
  },
  integrations: [umbracoSignalR()],
});
