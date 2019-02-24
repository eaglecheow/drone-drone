import * as net from "net";
import { codeTest } from "./test"


const PORT = 8080;
const HOST = "127.0.0.1";

const client = new net.Socket();

client.connect(PORT, HOST, () => {
    console.log("Client is connected");
    client.write("Connection established from client");
});

client.on("data", data => {
    console.log("Received: ", data);
    codeTest(data.toString())
});

client.on("close", () => {
    console.log("Connection closed");
});
