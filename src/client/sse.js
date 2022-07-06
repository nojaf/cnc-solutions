const signalR = require("signalr-client")
const client = new signalR.client(
  //signalR service URL
  "wss://cncsolutions-backend.azurewebsites.net/umbraco/backoffice/signalr/hubs",
  //"http://localhost:8435/umbraco/backoffice/signalr",
  // array of hubs to be supported in the connection
  ["GatsbyHub"]
)

client.serviceHandlers = {
  bindingError: (err) => {
    console.log(`err`, err)
  },
  onerror: (err) => {
    console.log(`err`, err)
  },
  connectFailed: (err) => {
    console.log(`err`, err)
  },
  disconnected: () => {
    console.log(`disconnected`)
  },
  connectionLost: (err) => {
    console.log(`err`, err)
  },
  connected: function (connection) {
    console.log("Websocket connected")
  },
}

client.on("GatsbyHub", "nodePublished", (e) => {
  console.log(`recevied`, e)
})
