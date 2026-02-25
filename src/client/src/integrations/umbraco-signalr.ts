import type { AstroIntegration } from "astro";
import signalR from "signalr-client";
import { clearTreeCache } from "../lib/umbraco";

export default function umbracoSignalR(): AstroIntegration {
  return {
    name: "umbraco-signalr",
    hooks: {
      "astro:server:setup": ({ server, refreshContent }) => {
        const client = new signalR.client(
          "wss://cncsolutions-backend.azurewebsites.net/umbraco/backoffice/signalr/hubs",
          ["GatsbyHub"]
        );

        client.on("GatsbyHub", "nodePublished", (nodeId: string) => {
          console.log(`[umbraco-signalr] Node published: ${nodeId}`);
          clearTreeCache();
          refreshContent?.({});
        });

        server.httpServer?.on("close", () => {
          client.end();
        });
      },
    },
  };
}
