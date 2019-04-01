import * as net from "net";
import { ServiceLayer } from "./index";
import { TcpStringGenerator } from "./helper/TcpStringGenerator";
import { DataParser } from "./helper/DataParser";
import { KeyframeHelper } from "./helper/KeyframeHelper";
import { ProcessCaller } from "./helper/ProcessCaller";
import { config } from "./config";
import { PathPlanner } from "./pathplanning/PathPlanner";

// ProcessCaller.callControlLayer(config.ctrlLayerLaunchfilePath);

let keyFrameHelper = new KeyframeHelper();

const PORT = 8080;
const DRONE_PORT = 8081;
const HOST = "127.0.0.1";

const droneClientInitDelay = 5000;
let isKeyframeInitSent = false;

const server = net.createServer();
let droneClient: net.Socket;

server.listen(PORT, HOST, () => {
    console.log(`TCP server running at ${HOST}:${PORT}`);
});

server.on("connection", async sock => {
    sock.on("data", data => {
        let dataString = data.toString();

        if (dataString.startsWith("K:")) {
            //Toggle Perception Layer initialized if previously false
            //Notifies Control layer that perception layer init complete
            if (!ServiceLayer.isPerceptionInit) {
                console.log(
                    "Perception Layer sent first keyframe, Perception Layer init complete..."
                );
                ServiceLayer.isPerceptionInit = true;
                console.log(
                    "Notifying Control Layer that Perception Layer init complete..."
                );
                droneClient.write(
                    TcpStringGenerator.perceptionLayerInitCompleteTcp()
                );
                return;
            }

            /** Keyframe */
            let currentRelativeFrameObj = DataParser.stringToKeyFrame(
                dataString
            );

            keyFrameHelper.currentRelativeLocation = [
                currentRelativeFrameObj.x,
                currentRelativeFrameObj.y,
                currentRelativeFrameObj.z
            ];

            console.log("keyFrameHelper.isInit: ", keyFrameHelper.isInit);

            console.log("Pinging Control Layer for real location...");
            droneClient.write(TcpStringGenerator.controlLayerLocationPingTcp());
        } else if (dataString.startsWith("droneserver")) {
            console.log("Control Layer requested for client connection...");
            console.log(
                `Waiting for ${droneClientInitDelay}ms before staring drone client...`
            );
            ServiceLayer.isControlInit = true;
            setTimeout(() => {
                console.log("Starting drone client...");
                droneClient = net.createConnection(
                    { host: HOST, port: DRONE_PORT },
                    () => {
                        console.log(
                            `TCP connection established with Control Layer Server at ${HOST}:${DRONE_PORT}`
                        );
                    }
                );

                droneClient.on("data", data => {
                    let dataString = data.toString();

                    //Keyframe
                    if (dataString.startsWith("KEYFRAME://")) {
                        let realLocation = DataParser.stringToDroneKeyframe(
                            dataString
                        );

                        keyFrameHelper.currentRealLocation = [
                            realLocation.x,
                            realLocation.y,
                            realLocation.z
                        ];
                        console.log(
                            "keyFrameHelper.gridScale: ",
                            keyFrameHelper.gridScale
                        );

                        ServiceLayer.keyframeHelper = keyFrameHelper;

                        if (!isKeyframeInitSent && keyFrameHelper.isInit) {
                            console.log(
                                "Notifying other layers Service Layer keyframe init complete"
                            );
                            droneClient.write("INIT://SERV@KEYFRAME");
                            sock.write("INIT://SERV@KEYFRAME");
                            isKeyframeInitSent = true;
                        }

                        return;
                    }

                    //Waypoint
                    if (dataString.startsWith("WP://")) {
                        let wayPointItem = DataParser.stringToWaypoint(
                            dataString
                        );

                        ServiceLayer.pathPlanner = new PathPlanner(
                            wayPointItem.startPoint,
                            wayPointItem.endPoints,
                            direction => {
                                droneClient.write(`TURN://${direction}`);
                            }
                        );

                        console.log(
                            "ServiceLayer.isInit: ",
                            ServiceLayer.isInit
                        );
                        console.log(
                            "ServiceLayer.pathPlanner.currentPath.startPoint: ",
                            ServiceLayer.pathPlanner.currentPath.startPoint
                        );
                        console.log(
                            "ServiceLayer.pathPlanner.currentPath.endPoint: ",
                            ServiceLayer.pathPlanner.currentPath.endPoint
                        );
                        console.log(
                            "ServiceLayer.pathPlanner.pathList: ",
                            ServiceLayer.pathPlanner.pathList
                        );

                        return;
                    }

                    //Current Location
                    if (dataString.startsWith("LOC://")) {
                        let currentLocItem = DataParser.stringToCurrentLocation(
                            dataString
                        );
                        console.log("currentLocItem: ", currentLocItem);
                        ServiceLayer.currentLocation =
                            currentLocItem.coordinate;
                        ServiceLayer.currentBearing = currentLocItem.heading;
                        if (!ServiceLayer.isInit) {
                            console.log(
                                "Attempting to initialize Service Layer..."
                            );
                            ServiceLayer.init();
                        }
                        console.log(
                            "ServiceLayer.isInit: ",
                            ServiceLayer.isInit
                        );
                        ServiceLayer.pathPlanner.updateCurrentPoint(
                            currentLocItem.coordinate
                        );
                        return;
                    }

                    //Request new path
                    if (dataString.startsWith("PATHEND://")) {
                        console.log("Control layer requests for new path...");
                        console.log("Sending new path...");
                        if (!ServiceLayer.finder) {
                            console.log("Finder not initialized yet...");
                            return;
                        }
                        let tcpString = TcpStringGenerator.finderToTCP(
                            ServiceLayer.finder
                        );
                        droneClient.write(tcpString);
                        return;
                    }
                });

                droneClient.on("end", () => {
                    console.log("Disconnected from drone server");
                });
            }, droneClientInitDelay);
        } else {
            /** Iteration */
            console.log("Calculating new possible path...");
            ServiceLayer.iterate(dataString);
        }
    });

    sock.on("close", () => {
        console.log("Socket closed");
    });
});
