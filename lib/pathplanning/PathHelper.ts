import geolib from "geolib";

export class PathHelper {
    public static generatePathBound = (
        startPoint: number[],
        endPoint: number[],
        width: number
    ): { latitude: number; longitude: number }[] => {
        let referenceDirection = geolib.getBearing(
            {
                latitude: startPoint[0],
                longitude: startPoint[1]
            },
            {
                latitude: endPoint[0],
                longitude: endPoint[1]
            }
        );

        let pointA = geolib.computeDestinationPoint(
            {
                latitude: startPoint[0],
                longitude: startPoint[1]
            },
            width,
            referenceDirection - 90
        );

        let pointB = geolib.computeDestinationPoint(
            {
                latitude: startPoint[0],
                longitude: startPoint[1]
            },
            width,
            referenceDirection + 90
        );

        let pointC = geolib.computeDestinationPoint(
            {
                latitude: endPoint[0],
                longitude: endPoint[1]
            },
            width,
            referenceDirection - 90
        );

        let pointD = geolib.computeDestinationPoint(
            {
                latitude: endPoint[0],
                longitude: endPoint[1]
            },
            width,
            referenceDirection - 90
        );

        return [pointA, pointB, pointC, pointD];
    };
}
