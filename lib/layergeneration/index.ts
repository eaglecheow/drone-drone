import { ObstacleCategory } from "./ObstacleCategory";
import { RelativeObstacleGrid } from "./RelativeObstacleGrid";
import { GridHelper } from "../helper/GridHelper";
import { GlobalObstacleGrid } from "./GlobalObstacleGrid";

const mapGrid = (
    layerObstacle: number[],
    gridSize: number[],
    rangeMin: number[],
    rangeMax: number[],
    currentLocation: number[],
    referenceDistance: number[],
    referenceBearing: number
): GlobalObstacleGrid => {
    let obstacleGrid = new RelativeObstacleGrid(gridSize, rangeMin, rangeMax);

    obstacleGrid.setObstacleWithLayerData(layerObstacle);
    let obstacleGlobal = new GlobalObstacleGrid(
        obstacleGrid,
        currentLocation,
        referenceDistance,
        referenceBearing
    );

    return obstacleGlobal;
};

export {
    ObstacleCategory,
    RelativeObstacleGrid,
    GlobalObstacleGrid,
    mapGrid,
    GridHelper
};