import * as net from "net";
import { codeTest } from "./test";

// const PORT = 8080;
// const DRONE_PORT = 8081;
// const HOST = "127.0.0.1";

// const server = net.createServer();
// server.listen(PORT, HOST, () => {
//     console.log(`TCP server running at ${HOST}:${PORT}`);
// });

// server.on("connection", async sock => {
//     sock.on("data", data => {
//         codeTest(data.toString());
//     });

//     sock.on("close", () => {
//         console.log("Socket closed");
//     });
// });

const startTime = Date.now();

// for (let i = 0; i < 100; i++) {
    codeTest();
    
// }

const endTime = Date.now();

console.log(`Process finished in ${endTime - startTime}ms`);
