// signalr-client ships no type declarations. Only the surface used by
// src/integrations/umbraco-signalr.ts is declared here.
declare module "signalr-client" {
  interface Retry {
    /** Spelled this way by the library. True for the first attempt of a run. */
    inital: boolean;
    count: number;
  }

  /**
   * Every handler is optional and unset by default, which is why an unhandled
   * connection failure is completely silent.
   */
  interface ServiceHandlers {
    bound?: () => void;
    connected?: (connection: unknown) => void;
    reconnected?: (connection: unknown) => void;
    disconnected?: () => void;
    connectFailed?: (error: unknown) => void;
    connectionLost?: (error: unknown) => void;
    onerror?: (error: unknown) => void;
    /** Returning true cancels the retry, so a logging handler must return false. */
    reconnecting?: (retry: Retry) => boolean;
  }

  class client {
    constructor(url: string, hubs: string[]);
    on(hub: string, method: string, handler: (...args: any[]) => void): void;
    end(): void;
    /** Assigning merges into the existing handlers rather than replacing them. */
    serviceHandlers: ServiceHandlers;
  }
  const signalR: { client: typeof client };
  export default signalR;
}
