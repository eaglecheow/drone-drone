import * as net from "net";
import { ServiceLayer } from "./index";
import { TcpStringGenerator } from "./helper/TcpStringGenerator";
import { DataParser } from "./helper/DataParser";
import { KeyframeHelper } from "helper/KeyframeHelper";

let keyFrameHelper = new KeyframeHelper();

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
    let dataString = data.toString();

    if (dataString.startsWith("Loc/Loc:")) {
        dataString = dataString.substring(8);

        let currentCoordinate: number[] = [];
        dataString.split(",").forEach((coordinateItem, index) => {
            currentCoordinate[index] = parseFloat(coordinateItem);
        });

        keyFrameHelper.currentRealLocation = currentCoordinate;

        return;
    }

    let droneData = DataParser.stringToDroneData(dataString);

    ServiceLayer.startLocation = droneData.startLoc;
    ServiceLayer.endLocation = droneData.endLoc;
    ServiceLayer.currentLocation = droneData.currentLoc;
    ServiceLayer.currentBearing = droneData.currentBearing;
});

droneClient.on("end", () => {
    console.log("Disconnected from drone server");
});

server.on("connection", async sock => {
    sock.on("data", data => {
        let dataString = data.toString();

        if (dataString.startsWith("K:")) {
            /** Keyframe */
            let currentRelativeFrameObj = DataParser.stringToKeyFrame(
                dataString
            );
            
            keyFrameHelper.currentRelativeLocation = [
                currentRelativeFrameObj.x,
                currentRelativeFrameObj.y,
                currentRelativeFrameObj.z
            ];
        } else {
            /** Iteration */
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
