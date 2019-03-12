import * as net from "net";
// import { codeTest } from "./test";
import { iterate } from "./index";

const PORT = 8080;
const DRONE_PORT = 8081;
const HOST = "127.0.0.1";

const server = net.createServer();

server.listen(PORT, HOST, () => {
    console.log(`TCP server running at ${HOST}:${PORT}`);
});

const droneClient = net.createConnection(
    { host: HOST, port: DRONE_PORT },
    () => {
        console.log(
            `TCP connection established with drone server at ${HOST}:${DRONE_PORT}`
        );
    }
);

droneClient.on("data", data => {
    //TODO: Handle data from drone
    droneClient.end();
});

droneClient.on("end", () => {
    console.log("Disconnected from drone server");
});

server.on("connection", async sock => {
    sock.on("data", data => {
        iterate(data.toString(), () => {
            //TODO: Implement TCP string logic
            droneClient.write("Hello");
        });
    });

    sock.on("close", () => {
        console.log("Socket closed");
    });
});

// const startTime = Date.now();

// // for (let i = 0; i < 100; i++) {
//     codeTest();

// // }

// const endTime = Date.now();

// console.log(`Process finished in ${endTime - startTime}ms`);
