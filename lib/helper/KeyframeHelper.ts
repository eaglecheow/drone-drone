export class KeyframeHelper {
    private _isInit: boolean = false;
    private _previousRelativeLocation: number[] = [];
    private _currentRelativeLocation: number[] = [];
    private _previousRealLocation: number[] = [];
    private _currentRealLocation: number[] = [];
    private _gridScale: number[] = [1, 1, 1];

    private initStatus = {
        previousRelLoc: false,
        currentRelLoc: false,
        previousRealLoc: false,
        currentRealLoc: false
    };

    public get isInit(): boolean {
        if (
            !this.initStatus.previousRelLoc ||
            !this.initStatus.currentRelLoc ||
            !this.initStatus.previousRealLoc ||
            !this.initStatus.currentRealLoc
        ) {
            this._isInit = false;
        } else {
            this._isInit = true;
        }

        return this._isInit;
    }

    public get previousRelativeLocation(): number[] {
        return this._previousRelativeLocation;
    }

    public get currentRelativeLocation(): number[] {
        return this._currentRelativeLocation;
    }

    public set currentRelativeLocation(value: number[]) {
        if (value.length !== 3)
            throw new Error("Invalid location format, should be [x, y, z]");

        if (this._currentRelativeLocation.length === 3) {
            this._previousRelativeLocation = this._currentRelativeLocation;
            this.initStatus.previousRelLoc = true;
        }

        this.initStatus.currentRelLoc = true;
        this._currentRelativeLocation = value;
    }

    public get previousRealLocation(): number[] {
        return this._previousRealLocation;
    }

    public get currentRealLocation(): number[] {
        return this._currentRealLocation;
    }

    public set currentRealLocation(value: number[]) {
        if (value.length !== 3)
            throw new Error("Invalid location format, should be [x, y, z]");

        if (this._currentRealLocation.length === 3) {
            this._previousRealLocation = this._currentRealLocation;
            this.initStatus.previousRealLoc = true;
        }

        this.initStatus.currentRealLoc = true;
        this._currentRealLocation = value;
    }

    public get gridScale(): number[] {
        this.iterateGridScale();
        return this._gridScale;
    }

    private iterateGridScale = () => {
        if (this.isInit) {
            let diffRel = [
                this._currentRelativeLocation[0] -
                    this._previousRelativeLocation[0],
                this._currentRelativeLocation[1] -
                    this._previousRelativeLocation[1],
                this._currentRelativeLocation[2] -
                    this._previousRelativeLocation[2]
            ];

            let diffReal = [
                this._currentRealLocation[0] - this._previousRealLocation[0],
                this._currentRealLocation[1] - this._previousRealLocation[1],
                this._currentRealLocation[2] - this._previousRealLocation[2]
            ];

            let scale = [
                diffReal[0] / diffRel[0],
                diffReal[1] / diffRel[1],
                diffReal[2] / diffRel[2]
            ];

            this._gridScale = scale;
        } else {
            console.warn("KeyframeHelper not initialized");
        }
    };
}
