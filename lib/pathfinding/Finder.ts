import { ObstacleCategory, mapGrid } from "../layergeneration";
import { VerticalLevelFinder } from "./VerticalLevelFinder";
import { LocalLevelFinder } from "./LocalLevelFinder";
import { MapScale } from "../layergeneration/MapScale";

export class Finder {
    private _targetPathLevel: number = 0;
    private _targetPathRelative: number[][] = [];
    private _targetPathGlobal: number[][] = [];
    private _obstacleCategory: ObstacleCategory;
    private _mapScale: MapScale;
    private _endCoordinate: number[];

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

    public get endCoordinate(): number[] {
        return this._endCoordinate;
    }

    public set endCoordinate(value: number[]) {
        if (value.length !== 2) {
            console.warn("End coordinate dimension invalid");
            return;
        }
        this._endCoordinate = value;
    }

    constructor(
        obstacleCategory: ObstacleCategory,
        mapScale: MapScale,
        endLocation: number[]
    ) {
        this._obstacleCategory = obstacleCategory;
        this._mapScale = mapScale;
        this._endCoordinate = endLocation;
        this.calculatePathData();
    }

    private calculatePathData() {
        let verticalLevelFinder = new VerticalLevelFinder(
            this._obstacleCategory,
            this._mapScale
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
            this._mapScale.gridSize,
            this._mapScale.rangeMin,
            this._mapScale.rangeMax,
            this._mapScale.currentLocation,
            this._mapScale.referenceDistance,
            this._mapScale.referenceBearing
        );

        let horizontalLevelFinder = new LocalLevelFinder(layerGrid, this._endCoordinate);

        this._targetPathLevel = verticalLevelFinder.flightLevel;
        this._targetPathRelative = horizontalLevelFinder.relativePath;
        this._targetPathGlobal = horizontalLevelFinder.globalPath;
    }
}
