import { Finder } from "../pathfinding/Finder";
import geolib from "geolib";

export class TcpStringGenerator {
    public static finderToTCP(finder: Finder): string {
        let coordinateList = finder.targetPathGlobal;

        let coordinateString = "";
        for (let i = 0; i < coordinateList.length; i++) {
            coordinateString = `${coordinateString}|${coordinateList[i][0]},${
                coordinateList[i][1]
            }`;
        }

        coordinateString = coordinateString + "|";

        let distanceList: number[] = [];
        let bearingList: number[] = [];

        for (let i = 0; i < coordinateList.length - 1; i++) {
            const currentCoordinate = {
                latitude: coordinateList[i][0],
                longitude: coordinateList[i][1]
            };

            const nextCoordinate = {
                latitude: coordinateList[i + 1][0],
                longitude: coordinateList[i + 1][1]
            };

            const distance = geolib.getDistance(
                currentCoordinate,
                nextCoordinate
            );

            const bearing = geolib.getBearing(
                currentCoordinate,
                nextCoordinate
            );

            distanceList.push(distance);
            bearingList.push(bearing);
        }

        let distanceString = "";
        let bearingString = "";

        for (let i = 0; i < distanceList.length; i++) {
            distanceString = `${distanceString}|${distanceList[i]}`;
            bearingString = `${bearingString}|${bearingList[i]}`;
        }

        distanceString = distanceString + "|";
        bearingString = bearingString + "|";

        return `${distanceString}@${bearingString}@${coordinateString}`;

        //|dist1|dist2|@|bearing1|bearing2|@|lat1,lng1|lat2,lng2|lat3,lng3|
    }

    public static controlLayerLocationPingTcp(): string {
        return "Loc/Loc"
    }
}
