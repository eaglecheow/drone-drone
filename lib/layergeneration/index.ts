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

/**
 * Generates a grid of 0s in a specific size
 * @param gridSize Grid size to generate
 */
export const gridGenerator = (gridSize: [number, number]): number[][] => {
    let gridTemplate: number[][] = [];
    for (let i = 0; i < gridSize[1]; i++) {
        gridTemplate[i] = [];
        for (let j = 0; j < gridSize[0]; j++) {
            gridTemplate[i].push(0);
        }
    }

    return gridTemplate;
};

/**
 * Maps the obstacle to a grid
 * @param layerObstacle Obstacle list if a certain layer
 * @param gridSize Size of the grid to be generated
 */
export const mapGrid = (
    layerObstacle: number[][],
    gridSize: [number, number]
) => {
    let layerObstacleGrid = gridGenerator(gridSize);
    // console.log(layerObstacleGrid);
    layerObstacle.forEach(obstacle => {
        const xzDistance = obstacle[0];
        const angle = obstacle[1];

        let x = xzDistance * Math.cos(angle);
        let z = xzDistance * Math.sin(angle);

        let targetX = Math.floor(x * gridSize[0]);
        let targetZ = Math.floor(z * gridSize[1]);

        // console.log(targetX);
        // console.log(targetZ);

        let xRange = gridSize[0] / 2;

        if (targetZ < gridSize[1] && Math.abs(targetX) <= Math.floor(xRange)) {
            // targetX = targetX + Math.floor(xRange);
            // console.log(targetX);
            layerObstacleGrid[targetZ][targetX] = 1;
        }
    });

    return layerObstacleGrid;
};
