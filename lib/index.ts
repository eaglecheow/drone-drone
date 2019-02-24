import * as net from "net";
import { codeTest } from "./test";

const PORT = 8080;
const HOST = "127.0.0.1";

const server = net.createServer();
server.listen(PORT, HOST, () => {
    console.log(`TCP server running at ${HOST}:${PORT}`);
});

server.on("connection", async sock => {
    sock.on("data", data => {
        console.log(data.toString());
        codeTest(data.toString());
    });

    sock.on("close", () => {
        console.log("Socket closed");
    });
});
