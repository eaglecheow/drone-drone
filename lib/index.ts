import { DataParser } from "./helper/DataParser";
import { Finder } from "./pathfinding/Finder";
import { devConfig } from "./config";
import { KeyframeHelper } from "./helper/KeyframeHelper";
import { MapScale } from "./layergeneration/MapScale";

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
    private static _startLocation: number[] = [0, 0];
    private static _endLocation: number[][] = [];
    private static _gridScale: number[] = [1, 1, 1];
    private static _keyframeHelper: KeyframeHelper;
    private static _isControlInit: boolean = false;
    private static _isPerceptionInit: boolean = false;

    private static initStatus = {
        gridScale: false,
        startPoint: false,
        endPoint: false,
        currentLocation: false,
        currentBearing: false
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

    public static get startLocation(): number[] {
        return this._startLocation;
    }

    public static set startLocation(value: number[]) {
        this._startLocation = value;
        this.initStatus.startPoint = true;
    }

    public static get endLocation(): number[][] {
        return this._endLocation;
    }

    public static set endLocation(value: number[][]) {
        this._endLocation = value;
        this.initStatus.endPoint = true;
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

    public static init = () => {
        let initCondition = true;
        Object.values(ServiceLayer.initStatus).forEach(isInit => {
            console.log("isInit: ", isInit);
            if (!isInit) initCondition = false;
        });

        if (initCondition) {
            ServiceLayer.mapScale = new MapScale(
                [5, 30],
                [0, 0],
                [5, 2],
                ServiceLayer.currentLocation,
                ServiceLayer.startLocation,
                ServiceLayer.endLocation[0],
                ServiceLayer.gridScale,
                ServiceLayer.currentBearing
            );

            ServiceLayer._isInit = true;
        } else {
            console.warn("Not enough data, unable to initialize");
        }
    };

    public static iterate = (
        stringData: string,
        callback: (finder: Finder) => void
    ) => {
        if (!ServiceLayer.isInit) {
            console.warn("Service Layer not init");
            return;
        }

        if (stringData.length <= 0) return;

        let obstacleCategory = DataParser.stringToGrid(stringData, [3, 5]);
        let finder = new Finder(
            obstacleCategory,
            ServiceLayer.mapScale,
            ServiceLayer.endLocation[0]
        );

        callback(finder);
    };
}
