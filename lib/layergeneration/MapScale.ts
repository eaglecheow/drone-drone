export class MapScale {
    private _gridSize: number[];
    private _rangeMin: number[];
    private _rangeMax: number[];
    private _currentLocation: number[];
    private _startPoint: number[];
    private _endPoint: number[];
    private _referenceDistance: number[];
    private _referenceBearing: number;

    public get gridSize(): number[] {
        return this._gridSize;
    }

    public get rangeMin(): number[] {
        return this._rangeMin;
    }

    public get rangeMax(): number[] {
        return this._rangeMax;
    }

    public get currentLocation(): number[] {
        return this._currentLocation;
    }

    public get startPoint(): number[] {
        return this._startPoint;
    }

    public get endPoint(): number[] {
        return this._endPoint;
    }

    public get referenceDistance(): number[] {
        return this._referenceDistance;
    }

    public get referenceBearing(): number {
        return this._referenceBearing;
    }

    constructor(
        gridSize: number[],
        rangeMin: number[],
        rangeMax: number[],
        currentLocation: number[],
        startPoint: number[],
        endPoint: number[],
        referenceDistance: number[],
        referenceBearing: number
    ) {
        this._gridSize = gridSize;
        this._rangeMin = rangeMin;
        this._rangeMax = rangeMax;
        this._currentLocation = currentLocation;
        this._startPoint = startPoint;
        this._endPoint = endPoint;
        this._referenceDistance = referenceDistance;
        this._referenceBearing = referenceBearing;
    }
}
