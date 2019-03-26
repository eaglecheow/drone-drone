export class Converter {
    private radius = 6371;

    private toRadian = (degree: number): number => {
        return (degree * Math.PI) / 180;
    };

    /**
     * Calculates the other point using distance and reference point. Assuming latitude
     * is constant.
     * Calculation done based on Haversine formula
     * @param distance Distance between 2 points
     * @param referencePoint Reference point
     * @param pointType Whether referencePoint is a start point or end point
     */
    public distanceToGpsPointLng = (
        distance: number,
        referencePoint: number[],
        pointType: "start" | "end"
    ) => {
        const a = 1 / (1 + Math.pow(Math.tan(distance / (2 * this.radius)), 2));

        let calculatedLng = 0;

        if (pointType === "start") {
            calculatedLng =
                referencePoint[1] -
                2 *
                    Math.asin(
                        Math.sqrt(a / Math.pow(Math.cos(referencePoint[0]), 2))
                    );
        } else {
            calculatedLng =
                2 *
                    Math.asin(
                        Math.sqrt(a / Math.pow(Math.cos(referencePoint[0]), 2))
                    ) +
                referencePoint[1];
        }

        // console.log(referencePoint);
        // console.log("a: ", a);
        // console.log("Calculated Longitude: ", calculatedLng);

        return [referencePoint[0], calculatedLng];
    };

    /**
     * Calculates the other point using distance and reference point. Assuming longitude
     * is constant.
     * Calculation done based on Haversine formula
     * @param distance Distance between 2 points
     * @param referencePoint Reference point
     * @param pointType Whether referencePoint is a start point or end point
     */
    public distanceToGpsPointLat = (
        distance: number,
        referencePoint: number[],
        pointType: "start" | "end"
    ): number[] => {
        const a = 1 / (1 + Math.pow(Math.tan(distance / (2 * this.radius)), 2));
        let calculatedLat = 0;
        if (pointType === "start") {
            calculatedLat = referencePoint[0] - 2 * Math.asin(Math.sqrt(a));
        } else {
            calculatedLat = 2 * Math.asin(Math.sqrt(a)) - referencePoint[0];
        }

        // console.log("Calculated Latitude: ", calculatedLat);

        return [calculatedLat, referencePoint[1]];
    };

    /**
     * Returns the distance between 2 GPS points using Haversine formula
     * This is a very rough approximation of distance
     * Refer to https://www.igismap.com/haversine-formula-calculate-geographic-distance-earth/ for formula
     * @param from Coordinate of the origin point
     * @param to Coordinate of the destination point
     */
    public gpsToDistanceHaversine = (
        from: number[],
        to: number[]
    ): number => {
        const fromLat = from[0];
        const fromLng = from[1];
        const toLat = to[0];
        const toLng = to[1];

        const latDiff = this.toRadian(toLat - fromLat);
        const lngDiff = this.toRadian(toLng - fromLng);

        const fromLatRad = this.toRadian(fromLat);
        const toLatRad = this.toRadian(toLat);

        const a =
            Math.pow(Math.sin(latDiff / 2), 2) +
            Math.pow(Math.sin(lngDiff / 2), 2) *
                Math.cos(fromLatRad) *
                Math.cos(toLatRad);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return this.radius * c;
    };

    public gpsToDistanceVincenty = () => {
        throw new Error("Not Implemented");
    };

    public gpsToDistanceRedFearns = () => {
        throw new Error("Not Implemented");
    };
}
