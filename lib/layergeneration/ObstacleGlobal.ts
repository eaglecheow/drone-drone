export class ObstacleGlobal {

    private _relativeGrid: number[][] = [];
    private _globalGrid: number[][] = [];
    private _currentLocation: [number, number] = [0, 0];

    public get relativeGrid(): number[][] {
        return this._relativeGrid
    }

    public get globalGrid(): number[][] {
        return this._globalGrid;
    }

    public get currentLocation(): [number, number] {
        return this._currentLocation;
    }

    public set currentLocation(value: [number, number]) {
        this._currentLocation = value;
    }
}