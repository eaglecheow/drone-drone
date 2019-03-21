import * as net from "net";
import { ServiceLayer } from "./index";
import { TcpStringGenerator } from "./helper/TcpStringGenerator";

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
        let dataString = data.toString();

        //Keyframe
        if (dataString.startsWith("##")) {
            //TODO: Handle keyframe
        } else {
            ServiceLayer.iterate(dataString, finder => {
                const controlTcpString = TcpStringGenerator.finderToTCP(finder);
                droneClient.write(controlTcpString);
            });
        }
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
