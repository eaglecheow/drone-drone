import { DataParser } from "./helper/DataParser";
import { Finder } from "./pathfinding/Finder";
import { devConfig } from "./config";
import { KeyframeHelper } from "./helper/KeyframeHelper";
import { MapScale } from "./layergeneration/MapScale";
import { PathPlanner } from "./pathplanning/PathPlanner";
import fs from "fs";

interface ScaleValue {
    gridSize: number[];
    rangeMin: number[];
    rangeMax: number[];
    currentLocation: number[];
    referenceDistance: number;
    referenceBearing: number;
}

export class ServiceLayer {
    //Default value, must be changed upon init
    // static scaleValue: ScaleValue = devConfig;

    private static _isInit: boolean = false;
    private static _currentLocation: number[] = [0, 0];
    private static _currentBearing: number = 0;
    private static _currentFlightLevel: number = 2;
    private static _gridScale: number[] = [1, 1, 1];
    private static _keyframeHelper: KeyframeHelper;
    private static _isControlInit: boolean = false;
    private static _isPerceptionInit: boolean = false;
    private static _finder: Finder;
    private static _pathPlanner: PathPlanner;

    private static initStatus = {
        gridScale: false,
        pathPlanner: false,
        currentLocation: false,
        currentBearing: false,
        currentFlightLevel: false
    };

    private static mapScale: MapScale;

    public static get isInit(): boolean {
        return this._isInit;
    }

    public static get currentLocation(): number[] {
        return this._currentLocation;
    }

    public static set currentLocation(value: number[]) {
        this._currentLocation = value;
        this.initStatus.currentLocation = true;
    }

    public static get currentBearing(): number {
        return this._currentBearing;
    }

    public static set currentBearing(value: number) {
        while (value > 360) {
            value -= 360;
        }

        this._currentBearing = value;
        this.initStatus.currentBearing = true;
    }

    public static get currentFlightLevel(): number {
        return this._currentFlightLevel;
    }

    public static set currentFlightLevel(value: number) {
        if (0 < value && value < 4) {
            this._currentFlightLevel = value;
            this.initStatus.currentFlightLevel = true;
        } else {
            console.log("Invalid flight level");
        }
    }

    public static get gridScale(): number[] {
        return this._gridScale;
    }

    public static get keyframeHelper(): KeyframeHelper {
        return this._keyframeHelper;
    }

    public static get isControlInit(): boolean {
        return this._isControlInit;
    }

    public static set isControlInit(value: boolean) {
        this._isControlInit = value;
    }

    public static get isPerceptionInit(): boolean {
        return this._isPerceptionInit;
    }

    public static set isPerceptionInit(value: boolean) {
        this._isPerceptionInit = value;
    }

    public static set keyframeHelper(value: KeyframeHelper) {
        this._keyframeHelper = value;

        if (this._keyframeHelper.isInit) {
            this._gridScale = this._keyframeHelper.gridScale;
            this.initStatus.gridScale = true;
        } else {
            console.warn("KeyframeHelper not init");
            this.initStatus.gridScale = false;
        }
    }

    public static get finder(): Finder {
        return this._finder;
    }

    public static get pathPlanner(): PathPlanner {
        return this._pathPlanner;
    }

    public static set pathPlanner(value: PathPlanner) {
        if (value) {
            this._pathPlanner = value;
            this.initStatus.pathPlanner = true;
        }
    }

    public static init = () => {
        let initCondition = true;
        Object.values(ServiceLayer.initStatus).forEach(isInit => {
            console.log("isInit: ", isInit);
            if (!isInit) initCondition = false;
        });

        console.log("initCondition: ", initCondition);
        console.log(Object.values(ServiceLayer.initStatus));
        if (initCondition) {
            console.log("ServiceLayer.gridScale: ", ServiceLayer.gridScale);
            fs.appendFile(
                "/home/jiaming/Desktop/droneLog.txt",
                ServiceLayer.gridScale + "\n",
                err => {
                    if (err) {
                        throw new Error(err.message);
                    }
                }
            );
            ServiceLayer.mapScale = new MapScale(
                [5, 30],
                [0, 0],
                [5, 2],
                ServiceLayer.currentLocation,
                ServiceLayer.pathPlanner.currentPath.startPoint,
                ServiceLayer.pathPlanner.currentPath.endPoint,
                ServiceLayer.gridScale,
                ServiceLayer.currentBearing
            );

            ServiceLayer._isInit = true;
        } else {
            console.warn("Not enough data, unable to initialize");
        }
    };

    public static updateCurrentPoint(coordinate: number[]) {
        throw new Error("Not Implemented");
    }

    public static iterate(
        stringData: string,
        callback: (finder: Finder) => void = () => {}
    ) {
        if (!ServiceLayer.isInit) {
            console.warn("Service Layer not init");
            return;
        }

        if (stringData.length <= 0) return;

        ServiceLayer.mapScale = new MapScale(
            [5, 30],
            [0, 0],
            [5, 2],
            ServiceLayer.currentLocation,
            ServiceLayer.pathPlanner.currentPath.startPoint,
            ServiceLayer.pathPlanner.currentPath.endPoint,
            ServiceLayer.gridScale,
            ServiceLayer.currentBearing
        );

        let obstacleCategory = DataParser.stringToGrid(stringData, [3, 5]);
        let finder = new Finder(
            obstacleCategory,
            this.mapScale,
            this._pathPlanner.currentPath.endPoint,
            this._currentFlightLevel
        );

        ServiceLayer._finder = finder;

        fs.appendFile(
            "/home/jiaming/Desktop/droneResult.txt",
            `
            Current Location: ${ServiceLayer.currentLocation[0]}, ${
                ServiceLayer.currentLocation[1]
            }
            Target Location: ${
                ServiceLayer.pathPlanner.currentPath.endPoint[0]
            }, ${ServiceLayer.pathPlanner.currentPath.endPoint[1]}
            Input Obstacle Grid: ${stringData}
            Output Path Relative: ${finder.targetPathRelative.map(value => {
                return `[${value[0]}, ${value[1]}]`;
            })}
            Output path Global: ${finder.targetPathGlobal.map(value => {
                return `[${value[0]}, ${value[1]}]`;
            })}
            `,
            err => {
                if (err) throw new Error(err.message);
            }
        );

        callback(finder);
    }
}
