import { GridHelper } from "./GridHelper";
import { ObstacleGrid } from "./ObstacleGrid";
import geolib from "geolib";

export class ObstacleGlobal {
    private _relativeGrid: number[][] = [];
    private _globalGrid: number[][][] = [];
    private _currentLocation: [number, number] = [0, 0];
    private _referenceDistance: number = 1;
    private _referenceBearing: number = 0;

    public get relativeGrid(): number[][] {
        return this._relativeGrid;
    }

    public get globalGrid(): number[][][] {
        return this._globalGrid;
    }

    public get currentLocation(): [number, number] {
        return this._currentLocation;
    }

    public set currentLocation(value: [number, number]) {
        this._currentLocation = value;
    }

    public get referenceDistance(): number {
        return this._referenceDistance;
    }

    public set referenceDistance(value: number) {
        this._referenceDistance = value;
    }

    public get referenceBearing(): number {
        return this._referenceBearing;
    }

    public set referenceBearing(value: number) {
        this._referenceBearing = value;
    }

    constructor(
        obstacleGrid: ObstacleGrid,
        currentLocation: [number, number],
        referenceDistance: number,
        referenceBearing: number
    ) {
        this._relativeGrid = obstacleGrid.gridData;
        this._currentLocation = currentLocation;
        this._referenceDistance = referenceDistance;
        this._referenceBearing = referenceBearing;
        this.convertRelativeToGlobal(1, 0);
    }

    private getBearing = (
        bearingReference: number,
        targetDirection: "north" | "south" | "east" | "west"
    ): number => {
        let resultBearing = 0;

        switch (targetDirection) {
            case "north": {
                resultBearing = bearingReference;
                break;
            }
            case "south": {
                resultBearing = bearingReference + 180;
                break;
            }
            case "east": {
                resultBearing = bearingReference + 90;
                break;
            }
            case "west": {
                resultBearing = bearingReference + 270;
            }
        }

        if (resultBearing > 360) {
            resultBearing -= 360;
        }

        return resultBearing;
    };

    private convertRelativeToGlobal = (
        referenceDistance: number,
        referenceBearing: number
    ): void => {
        const gridLengthX = this._relativeGrid[0].length;
        let currentRelativeIndexX = 0;
        if (gridLengthX % 2 === 0) {
            currentRelativeIndexX = gridLengthX / 2;
        } else {
            currentRelativeIndexX = (gridLengthX + 1) / 2 - 1;
        }

        this._globalGrid = GridHelper.generateGrid<number[]>(
            [this._relativeGrid[0].length, this._relativeGrid.length],
            [0, 0]
        );
        this._globalGrid[0][currentRelativeIndexX] = this._currentLocation;

        for (let i = currentRelativeIndexX - 1; i >= 0; i--) {
            let initialPoint = {
                latitude: this._globalGrid[0][i + 1][0],
                longitude: this._globalGrid[0][i + 1][1]
            };

            let calculatedPoint = geolib.computeDestinationPoint(
                initialPoint,
                referenceDistance,
                this.getBearing(referenceBearing, "west")
            );

            this._globalGrid[0][i] = [
                calculatedPoint.latitude,
                calculatedPoint.longitude
            ];
        }

        for (
            let i = currentRelativeIndexX + 1;
            i < this._globalGrid[0].length;
            i++
        ) {
            let initialPoint = {
                latitude: this._globalGrid[0][i - 1][0],
                longitude: this._globalGrid[0][i - 1][1]
            };

            let calculatedPoint = geolib.computeDestinationPoint(
                initialPoint,
                referenceDistance,
                this.getBearing(referenceBearing, "east")
            );

            this._globalGrid[0][i] = [
                calculatedPoint.latitude,
                calculatedPoint.longitude
            ];
        }

        for (let i = 1; i < this._globalGrid.length; i++) {
            this._globalGrid[i].forEach((_, index) => {
                let initialPoint = {
                    latitude: this._globalGrid[i - 1][index][0],
                    longitude: this._globalGrid[i - 1][index][1]
                };

                let calculatedPoint = geolib.computeDestinationPoint(
                    initialPoint,
                    referenceDistance,
                    this.getBearing(referenceBearing, "north")
                );

                this._globalGrid[i][index] = [
                    calculatedPoint.latitude,
                    calculatedPoint.longitude
                ];
            });
        }

        console.log("Global Grid: ", this._globalGrid);
    };
}
