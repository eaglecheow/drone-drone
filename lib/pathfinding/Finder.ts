import { ObstacleCategory, mapGrid } from "../layergeneration";
import { VerticalLevelFinder } from "./VerticalLevelFinder";
import { devConfig } from "../config";
import { LocalLevelFinder } from "./LocalLevelFinder";

export class Finder {
    private _targetPathLevel: number = 0;
    private _targetPathRelative: number[][] = [];
    private _targetPathGlobal: number[][] = [];
    private _obstacleCategory: ObstacleCategory;

    public get targetPathLevel(): number {
        return this._targetPathLevel;
    }

    public get targetPathRelative(): number[][] {
        return this._targetPathRelative;
    }

    public get targetPathGlobal(): number[][] {
        return this._targetPathGlobal;
    }

    public get obstacleCategory(): ObstacleCategory {
        return this._obstacleCategory;
    }

    public set obstacleCategory(value: ObstacleCategory) {
        this._obstacleCategory = value;
        this.calculatePathData();
    }

    constructor(obstacleCategory: ObstacleCategory) {
        this._obstacleCategory = obstacleCategory;
        this.calculatePathData();
    }

    private calculatePathData() {
        let verticalLevelFinder = new VerticalLevelFinder(
            this._obstacleCategory
        );
        let layerObstacle: number[] = [];

        switch (verticalLevelFinder.flightLevel) {
            case 1: {
                layerObstacle = this._obstacleCategory.level1;
                break;
            }
            case 2: {
                layerObstacle = this._obstacleCategory.level2;
                break;
            }
            case 3: {
                layerObstacle = this._obstacleCategory.level3;
                break;
            }
        }

        let layerGrid = mapGrid(
            layerObstacle,
            devConfig.gridSize,
            devConfig.rangeMin,
            devConfig.rangeMax,
            devConfig.currentLocation,
            devConfig.referenceDistance,
            devConfig.referenceBearing
        );

        let horizontalLevelFinder = new LocalLevelFinder(layerGrid);

        this._targetPathLevel = verticalLevelFinder.flightLevel;
        this._targetPathRelative = horizontalLevelFinder.relativePath;
        this._targetPathGlobal = horizontalLevelFinder.globalPath;
    }
}