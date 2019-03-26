import { ObstacleCategory } from "../layergeneration/ObstacleCategory";
import { mapGrid } from "../layergeneration";
import { devConfig } from "../config";
import { MapScale } from "../layergeneration/MapScale";

export class VerticalLevelFinder {
    private _pathLevel: number = 0;
    private _obstacleCategory: ObstacleCategory;
    private _mapScale: MapScale;

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

    constructor(obstacleCategory: ObstacleCategory, mapScale: MapScale) {
        this._obstacleCategory = obstacleCategory;
        this._mapScale = mapScale;
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
                this._mapScale.gridSize,
                this._mapScale.rangeMin,
                this._mapScale.rangeMax,
                this._mapScale.currentLocation,
                this._mapScale.referenceDistance,
                this._mapScale.referenceBearing
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
