import { ObstacleCategory } from "../layergeneration/ObstacleCategory";
import { mapGrid } from "../layergeneration";
import { devConfig } from "../config";
import { MapScale } from "../layergeneration/MapScale";

export class VerticalLevelFinder {
    private _currentPathLevel: number;
    private _targetPathLevel: number = 0;
    private _obstacleCategory: ObstacleCategory;
    private _mapScale: MapScale;

    public get targetPathLevel(): number {
        return this._targetPathLevel;
    }

    public get obstacleCategory(): ObstacleCategory {
        return this._obstacleCategory;
    }

    public set obstacleCategory(value: ObstacleCategory) {
        this._obstacleCategory = value;
        this.levelDecision();
    }

    constructor(
        obstacleCategory: ObstacleCategory,
        mapScale: MapScale,
        currentPathLevel: number
    ) {
        this._obstacleCategory = obstacleCategory;
        this._mapScale = mapScale;
        this._currentPathLevel = currentPathLevel;
        this.levelDecision();
    }

    private levelDecision() {

        let iterateLevel = [0, 1, 2];
        switch (this._currentPathLevel) {
            case 1: {
                iterateLevel = iterateLevel.splice(2, 1);
                break;
            }
            case 3: {
                iterateLevel = iterateLevel.splice(0, 1);
                break;
            } 
        }

        let obstacleLevels = [
            this._obstacleCategory.level1,
            this._obstacleCategory.level2,
            this._obstacleCategory.level3
        ];

        let emptySpaceAmount = 0;
        let maxEmptySpaceIndex = 0;

        for (let i = 0; i < iterateLevel.length; i++) {
            let relativeGrid = mapGrid(
                obstacleLevels[iterateLevel[i]],
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
                maxEmptySpaceIndex = iterateLevel[i];
            }
        }

        // obstacleLevels.forEach((levelObstacle, index) => {
        //     let relativeGrid = mapGrid(
        //         levelObstacle,
        //         this._mapScale.gridSize,
        //         this._mapScale.rangeMin,
        //         this._mapScale.rangeMax,
        //         this._mapScale.currentLocation,
        //         this._mapScale.referenceDistance,
        //         this._mapScale.referenceBearing
        //     ).relativeGrid;

        //     let emptySpaceCounter = 0;

        //     for (let i = 0; i < relativeGrid.length; i++) {
        //         for (let j = 0; j < relativeGrid[i].length; j++) {
        //             if (relativeGrid[j][i] === 0) emptySpaceCounter++;
        //         }
        //     }

        //     if (emptySpaceCounter >= emptySpaceAmount) {
        //         emptySpaceAmount = emptySpaceCounter;
        //         maxEmptySpaceIndex = index;
        //     }
        // });

        this._targetPathLevel = maxEmptySpaceIndex + 1;
    }
}
