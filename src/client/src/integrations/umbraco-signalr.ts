import type { AstroIntegration } from "astro";
import signalR from "signalr-client";
import { clearTreeCache } from "../lib/umbraco";

const HUB = "GatsbyHub";

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export default function umbracoSignalR(): AstroIntegration {
  return {
    name: "umbraco-signalr",
    hooks: {
      "astro:server:setup": ({ server, refreshContent, logger }) => {
        const client = new signalR.client(
          "wss://cncsolutions-backend.azurewebsites.net/umbraco/backoffice/signalr/hubs",
          [HUB],
        );

        // Without these the client is silent about its own state, so a dropped
        // connection is indistinguishable from a CMS nobody is publishing to.
        client.serviceHandlers = {
          connected: () => logger.info("Connected to the Umbraco hub"),
          reconnected: () => logger.info("Reconnected to the Umbraco hub"),
          disconnected: () => logger.warn("Disconnected from the Umbraco hub"),
          connectFailed: (error) =>
            logger.error(
              `Could not connect to the Umbraco hub: ${describe(error)}`,
            ),
          connectionLost: (error) =>
            logger.warn(`Lost the Umbraco hub connection: ${describe(error)}`),
          onerror: (error) =>
            logger.error(`Umbraco hub error: ${describe(error)}`),
          // The client retries every 10 seconds indefinitely on its own.
          // Returning true here would cancel that, so only log and carry on.
          reconnecting: (retry) => {
            logger.warn(
              `Reconnecting to the Umbraco hub, attempt ${retry.count}`,
            );
            return false;
          },
        };

        client.on(HUB, "nodePublished", (nodeId: string) => {
          logger.info(`Node published: ${nodeId}`);
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
