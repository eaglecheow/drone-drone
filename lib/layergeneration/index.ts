export interface ObstacleData {
    obstacleLocation: number[][];
    obstacleDistance: number[];
    obstacleAngle: number[];
}

export interface ObstacleCategory {
    level1: number[][];
    level2: number[][];
    level3: number[][];
}

/** DEPRECATED */
// /**
//  * Categorize obstacles to 3 different levels
//  * @param obstacleMap Collection of obstacle detected
//  * @param cameraHeight Height of camera top and bottom in real scale
//  */
// export const categorizeArea = (
//     obstacleMap: number[][],
//     cameraHeight: number
// ): ObstacleCategory => {
//     const layerHeight = cameraHeight / 3;

//     let obstacleCategory: ObstacleCategory = {
//         level1: [],
//         level2: [],
//         level3: []
//     };

//     obstacleMap.forEach(obstacle => {
//         if (obstacle[2] > 2 * layerHeight) {
//             obstacleCategory.level3.push(obstacle);
//         } else if (obstacle[2] > layerHeight) {
//             obstacleCategory.level2.push(obstacle);
//         } else {
//             obstacleCategory.level1.push(obstacle);
//         }
//     });

//     return obstacleCategory;
// };

export class ObstacleGrid {
    constructor(
        gridSize: [number, number],
        rangeMin: [number, number],
        rangeMax: [number, number]
    ) {
        if (gridSize[0] <= 0 || gridSize[1] <= 0)
            throw new Error("Invalid grid size");
        this._gridData = this.generateGrid(gridSize);
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

    private generateGrid = (gridSize: [number, number]): number[][] => {
        let gridTemplate: number[][] = [];
        for (let i = 0; i < gridSize[1]; i++) {
            gridTemplate[i] = [];
            for (let j = 0; j < gridSize[0]; j++) {
                gridTemplate[i].push(0);
            }
        }

        return gridTemplate;
    };

    public setObstacleWithIndex = (
        obstacleLocation: [number, number]
    ): void => {
        const obstacleX = obstacleLocation[0];
        const obstacleZ = obstacleLocation[1];

        const lengthZ = this._gridData.length;
        const lengthX = this._gridData[0].length;

        if (obstacleX > lengthX - 1) {
            console.warn("X index exceeds X length, obstacle not assigned");
            return;
        }

        if (obstacleZ > lengthZ - 1) {
            console.warn("Z index exceeds Z length, obstacle not assigned");
            return;
        }

        this._gridData[obstacleZ][obstacleX] = 1;
    };

    public setObstacleWithValue = (obstacleLocation: number[]): void => {
        const obstacleXReal = obstacleLocation[0];
        const obstacleZReal = obstacleLocation[1];
        const lengthX = this._gridData[0].length;
        const lengthZ = this._gridData.length;

        const gridRangeX = this._gridRangeMax[0] - this._gridRangeMin[0];
        const gridRangeZ = this._gridRangeMax[1] - this._gridRangeMin[1];

        if (
            obstacleXReal < this._gridRangeMin[0] ||
            obstacleXReal > this._gridRangeMax[0]
        ) {
            console.warn(
                "X value out of provided range, obstacle not assigned"
            );
            return;
        }

        if (
            obstacleZReal < this._gridRangeMin[1] ||
            obstacleZReal > this._gridRangeMax[1]
        ) {
            console.warn(
                "Z value out of provided range, obstacle not assigned"
            );
            return;
        }

        let targetX =
            Math.ceil(
                (obstacleXReal - this._gridRangeMin[0]) * (lengthX / gridRangeX)
            ) - 1;
        let targetZ =
            Math.ceil(
                (obstacleZReal - this._gridRangeMin[1]) * (lengthZ / gridRangeZ)
            ) - 1;

        this.setObstacleWithIndex([targetX, targetZ]);
    };
}

export const mapGrid = (
    layerObstacle: number[][],
    gridSize: [number, number],
    rangeMin: [number, number],
    rangeMax: [number, number]
): number[][] => {
    let obstacleGrid = new ObstacleGrid(gridSize, rangeMin, rangeMax);
    layerObstacle.forEach(obstacle => {
        obstacleGrid.setObstacleWithValue(obstacle);
    });

    return obstacleGrid.gridData;
};

/** DEPRECATED */
// /**
//  * Generates a grid of 0s in a specific size
//  * @param gridSize Grid size to generate
//  */
// export const gridGenerator = (gridSize: [number, number]): number[][] => {
//     let gridTemplate: number[][] = [];
//     for (let i = 0; i < gridSize[1]; i++) {
//         gridTemplate[i] = [];
//         for (let j = 0; j < gridSize[0]; j++) {
//             gridTemplate[i].push(0);
//         }
//     }

//     return gridTemplate;
// };

/** DEPRECATED */
// /**
//  * Maps the obstacle to a grid
//  * @param layerObstacle Obstacle list if a certain layer
//  * @param gridSize Size of the grid to be generated
//  */
// export const mapGrid = (
//     layerObstacle: number[][],
//     gridSize: [number, number]
// ) => {
//     let layerObstacleGrid = gridGenerator(gridSize);
//     // console.log(layerObstacleGrid);
//     layerObstacle.forEach(obstacle => {
//         const xzDistance = obstacle[0];
//         const angle = obstacle[1];

//         let x = xzDistance * Math.cos(angle);
//         let z = xzDistance * Math.sin(angle);

//         let targetX = Math.floor(x * gridSize[0]);
//         let targetZ = Math.floor(z * gridSize[1]);

//         console.log(`X: ${x}, Z: ${z}`);

//         let xRange = gridSize[0] / 2;

//         if (targetZ < gridSize[1] && Math.abs(targetX) <= Math.floor(xRange)) {
//             targetX = targetX + Math.floor(xRange);
//             // console.log(targetX);
//             // console.log(`X: ${targetX}, Z: ${targetZ}`);
//             layerObstacleGrid[targetZ][targetX] = 1;
//         }
//     });

//     return layerObstacleGrid;
// };
