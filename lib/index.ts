import { DataParser } from "./helper/DataParser";
import { Finder } from "./pathfinding/Finder";
import { devConfig } from "./config";

interface ScaleValue {
    gridSize: [number, number];
    rangeMin: [number, number];
    rangeMax: [number, number];
    currentLocation: number[];
    referenceDistance: number;
    referenceBearing: number;
}

export class ServiceLayer {
    //Default value, must be changed upon init
    static scaleValue: ScaleValue = devConfig;

    private static _isInit: boolean = false;
    private static _currentLocation: number[] = [0, 0];
    private static _currentBearing: number = 0;
    private static _startLocation: number[] = [0, 0];
    private static _endLocation: number[][] = [];
    private static _gridScale: number = 0;

    public static get isInit(): boolean {
        return this._isInit;
    }

    public static get currentLocation(): number[] {
        return this._currentLocation;
    }

    public static set currentLocation(value: number[]) {
        this._currentLocation = value;
    }

    public static get currentBearing(): number {
        return this._currentBearing;
    }

    public static set currentBearing(value: number) {
        while (value > 360) {
            value -= 360;
        }

        this._currentBearing = value;
    }

    public static get startLocation(): number[] {
        return this._startLocation;
    }

    public static set startLocation(value: number[]) {
        this._startLocation = value;
    }

    public static get endLocation(): number[][] {
        return this._endLocation;
    }

    public static set endLocation(value: number[][]) {
        this._endLocation = value;
    }

    public static get gridScale(): number {
        return this._gridScale;
    }

    public static set gridScale(value: number) {
        this._gridScale = value;
    }

    /**
     * Initialization Process of Service Layer
     * 1. Check for keyframe and perform calculation for scaling purpose
     * 2. Adjust scale value
     * 3.
     */
    public static init = () => {
        //TODO: Write init implementation
        throw new Error("Not Implemented");
    };

    public static adjustScaleValue = (stringData: string) => {
        let keyframeValue = DataParser.stringToKeyFrame(stringData);

        throw new Error("Not Implemented");
    };

    public static iterate = (
        stringData: string,
        callback: (finder: Finder) => void
    ) => {
        if (stringData.length <= 0) return;

        let obstacleCategory = DataParser.stringToGrid(stringData, [3, 5]);
        let finder = new Finder(obstacleCategory);

        callback(finder);
    };
}
