export class PathPlanner {
    private _startPoint: number[];
    private _endPointList: number[][];

    public get startPoint(): number[] {
        return this._startPoint;
    }

    public get endPointList(): number[][] {
        return this._endPointList;
    }

    constructor(startPoint: number[], endPointList: number[][]) {
        this._startPoint = startPoint;
        this._endPointList = endPointList;
    }
}