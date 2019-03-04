import { GridHelper } from "./GridHelper";
import { ObstacleGrid } from "./ObstacleGrid";
import { Converter } from "../helper/Converter";

const converter = new Converter();
export class ObstacleGlobal {
    private _relativeGrid: number[][] = [];
    private _globalGrid: number[][][] = [];
    private _currentLocation: [number, number] = [0, 0];

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

    constructor(obstacleGrid: ObstacleGrid, currentLocation: [number, number]) {
        this._relativeGrid = obstacleGrid.gridData;
        this._currentLocation = currentLocation;
        this.convertRelativeToGlobal();
    }

    private convertRelativeToGlobal = (): void => {
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
            this._globalGrid[0][i] = converter.distanceToGpsPointLng(
                1,
                this.globalGrid[0][i + 1],
                "end"
            );
        }

        for (
            let i = currentRelativeIndexX + 1;
            i < this._globalGrid[0].length;
            i++
        ) {
            this._globalGrid[0][1] = converter.distanceToGpsPointLat(
                1,
                this.globalGrid[0][i - 1],
                "start"
            );
        }

        // console.log("Global Grid: ", this._globalGrid);
    };
}
