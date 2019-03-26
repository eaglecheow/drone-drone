import { GridHelper } from "../helper/GridHelper";

export class RelativeObstacleGrid {
    constructor(
        gridSize: number[],
        rangeMin: number[],
        rangeMax: number[]
    ) {
        if (gridSize[0] <= 0 || gridSize[1] <= 0)
            throw new Error("Invalid grid size");
        this._gridData = GridHelper.generateGrid<number>(gridSize, 0);
        this._gridRangeMin = rangeMin;
        this._gridRangeMax = rangeMax;
    }

    private _gridData: number[][] = [];
    private _gridRangeMin: number[] = [0, 0];
    private _gridRangeMax: number[] = [10, 10];

    public get gridData(): number[][] {
        return this._gridData;
    }

    public get gridRangeMin(): number[] {
        return this._gridRangeMin;
    }

    public set gridRangeMin(value: number[]) {
        this._gridRangeMin = value;
    }

    public get gridRangeMax(): number[] {
        return this._gridRangeMax;
    }

    public set gridRangeMax(value: number[]) {
        this._gridRangeMax = value;
    }

    public setObstacleWithIndex = (
        obstacleLocation: number[]
    ): void => {
        // console.log(obstacleLocation);

        const obstacleX = obstacleLocation[0];
        const obstacleZ = obstacleLocation[1];

        const lengthZ = this._gridData.length;
        const lengthX = this._gridData[0].length;

        if (obstacleX > lengthX - 1) {
            console.warn(
                `X index exceeds X length, obstacle not assigned [xIndex = ${obstacleX}]`
            );
            return;
        }

        if (obstacleZ > lengthZ - 1) {
            console.warn(
                `Z index exceeds Z length, obstacle not assigned [zIndex = ${obstacleZ}]`
            );
            return;
        }

        for (let i = obstacleZ; i < this._gridData.length; i++) {
            this.gridData[i][obstacleX] = 1;
        }

    };

    public setObstacleWithLayerData = (layerData: number[]) => {

        // console.log("layerData: ", layerData);

        layerData.forEach((data, index) => {
            const targetX = index;

            const obstacleZReal = data;
            const lengthZ = this._gridData.length;
            const gridRangeZ = this._gridRangeMax[1] - this._gridRangeMin[1];
            if (
                obstacleZReal < this._gridRangeMin[1] ||
                obstacleZReal > this._gridRangeMax[1]
            ) {
                console.warn(
                    `Z value out of provided range, obstacle not assigned [z = ${obstacleZReal}]`
                );
                return;
            }
            let targetZ =
                Math.ceil(
                    (obstacleZReal - this._gridRangeMin[1]) *
                        (lengthZ / gridRangeZ)
                ) - 1;

            if (targetZ === -1) targetZ = 0;

            try {
                // console.log("[targetX, targetZ]: ", [targetX, targetZ]);
                this.setObstacleWithIndex([targetX, targetZ]);
            } catch (e) {
                console.log("Layer Data: ", layerData);
                console.log("obstacleZReal: ", obstacleZReal);
                console.log("TargetZ: ", targetZ);
                throw new Error("Vote Alex for President 2020");
            }
        });
    };
}
