export class ObstacleCategory {

    constructor() {
        this._level1 = [];
        this._level2 = [];
        this._level3 = [];
    }

    private _level1: number[][] = [];
    private _level2: number[][] = [];
    private _level3: number[][] = [];

    public get level1(): number[][] {
        return this._level1;
    }

    public set level1(value: number[][]) {
        this._level1 = value;
    }

    public get level2(): number[][] {
        return this._level2;
    }

    public set level2(value: number[][]) {
        this._level2 = value;
    }

    public get level3(): number[][] {
        return this._level3;
    }

    public set level3(value: number[][]) {
        this._level3 = value;
    }
}