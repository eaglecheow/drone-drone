import { ObstacleCategory } from "../layergeneration/ObstacleCategory";
import { mapGrid } from "../layergeneration";
import { devConfig } from "../config";

export class VerticalLevelFinder {
    private _pathLevel: number = 0;
    private _obstacleCategory: ObstacleCategory;

    public get flightLevel(): number {
        return this._pathLevel;
    }

    public get obstacleCategory(): ObstacleCategory {
        return this._obstacleCategory;
    }

    public set obstacleCategory(value: ObstacleCategory) {
        this._obstacleCategory = value;
        this.levelDecision();
    }

    constructor(obstacleCategory: ObstacleCategory) {
        this._obstacleCategory = obstacleCategory;
        this.levelDecision();
    }

    private levelDecision() {
        let obstacleLevels = [
            this._obstacleCategory.level1,
            this._obstacleCategory.level2,
            this._obstacleCategory.level3
        ];

        let emptySpaceAmount = 0;
        let maxEmptySpaceIndex = 0;

        obstacleLevels.forEach((levelObstacle, index) => {
            let relativeGrid = mapGrid(
                levelObstacle,
                devConfig.gridSize,
                devConfig.rangeMin,
                devConfig.rangeMax,
                devConfig.currentLocation,
                devConfig.referenceDistance,
                devConfig.referenceBearing
            ).relativeGrid;

            let emptySpaceCounter = 0;

            for (let i = 0; i < relativeGrid.length; i++) {
                for (let j = 0; j < relativeGrid[i].length; j++) {
                    if (relativeGrid[j][i] === 0) emptySpaceCounter++;
                }
            }

            if (emptySpaceCounter >= emptySpaceAmount) {
                emptySpaceAmount = emptySpaceCounter;
                maxEmptySpaceIndex = index;
            }
        });

        this._pathLevel = maxEmptySpaceIndex + 1;
    }
}

