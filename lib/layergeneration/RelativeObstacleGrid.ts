import { GridHelper } from "./GridHelper";

export class RelativeObstacleGrid {
    constructor(
        gridSize: [number, number],
        rangeMin: [number, number],
        rangeMax: [number, number]
    ) {
        if (gridSize[0] <= 0 || gridSize[1] <= 0)
            throw new Error("Invalid grid size");
        this._gridData = GridHelper.generateGrid<number>(gridSize, 0);
        this._gridRangeMin = rangeMin;
        this._gridRangeMax = rangeMax;
    }

    private _gridData: number[][] = [];
    private _gridRangeMin: [number, number] = [0, 0];
    private _gridRangeMax: [number, number] = [10, 10];

    public get gridData(): number[][] {
        return this._gridData;
    }

    public get gridRangeMin(): [number, number] {
        return this._gridRangeMin;
    }

    public set gridRangeMin(value: [number, number]) {
        this._gridRangeMin = value;
    }

    public get gridRangeMax(): [number, number] {
        return this._gridRangeMax;
    }

    public set gridRangeMax(value: [number, number]) {
        this._gridRangeMax = value;
    }

    /** DEPRECATED */
    // private generateGrid = (gridSize: [number, number]): number[][] => {
    //     let gridTemplate: number[][] = [];
    //     for (let i = 0; i < gridSize[1]; i++) {
    //         gridTemplate[i] = [];
    //         for (let j = 0; j < gridSize[0]; j++) {
    //             gridTemplate[i].push(0);
    //         }
    //     }

    //     return gridTemplate;
    // };

    public setObstacleWithIndex = (
        obstacleLocation: [number, number]
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

        this._gridData[obstacleZ][obstacleX] = 1;
    };

    public setObstacleWithLayerData = (layerData: number[]) => {
        // console.log("Layer Data: ", layerData);

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
                this.setObstacleWithIndex([targetX, targetZ]);
            } catch (e) {
                console.log("Layer Data: ", layerData);
                console.log("obstacleZReal: ", obstacleZReal);
                console.log("TargetZ: ", targetZ);
                throw new Error("Vote Alex for President 2020");
            }
        });
    };

    /** DEPRECATED */
    // public setObstacleWithValue = (range: number, angle: number): void => {
    //     // console.log("range: ", range);
    //     // console.log("angle: ", angle);

    //     const obstacleXReal = range * Math.cos(angle);
    //     const obstacleZReal = range * Math.sin(angle);

    //     // console.log("obstacleXReal: ", obstacleXReal);
    //     // console.log("obstacleZReal: ", obstacleZReal);

    //     const lengthX = this._gridData[0].length;
    //     const lengthZ = this._gridData.length;

    //     const gridRangeX = this._gridRangeMax[0] - this._gridRangeMin[0];
    //     const gridRangeZ = this._gridRangeMax[1] - this._gridRangeMin[1];

    //     if (
    //         obstacleXReal < this._gridRangeMin[0] ||
    //         obstacleXReal > this._gridRangeMax[0]
    //     ) {
    //         console.warn(
    //             `X value out of provided range, obstacle not assigned [x = ${obstacleXReal}]`
    //         );
    //         return;
    //     }

    //     if (
    //         obstacleZReal < this._gridRangeMin[1] ||
    //         obstacleZReal > this._gridRangeMax[1]
    //     ) {
    //         console.warn(
    //             `Z value out of provided range, obstacle not assigned [z = ${obstacleZReal}]`
    //         );
    //         return;
    //     }

    //     let targetX =
    //         Math.ceil(
    //             (obstacleXReal - this._gridRangeMin[0]) * (lengthX / gridRangeX)
    //         ) - 1;
    //     let targetZ =
    //         Math.ceil(
    //             (obstacleZReal - this._gridRangeMin[1]) * (lengthZ / gridRangeZ)
    //         ) - 1;

    //     this.setObstacleWithIndex([targetX, targetZ]);
    // };
}
