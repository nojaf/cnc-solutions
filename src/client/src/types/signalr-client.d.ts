// signalr-client ships no type declarations. Only the surface used by
// src/integrations/umbraco-signalr.ts is declared here.
declare module "signalr-client" {
  class client {
    constructor(url: string, hubs: string[]);
    on(hub: string, method: string, handler: (...args: any[]) => void): void;
    end(): void;
  }
  const signalR: { client: typeof client };
  export default signalR;
}
