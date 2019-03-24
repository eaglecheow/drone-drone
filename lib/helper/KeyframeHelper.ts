export class KeyframeHelper {
    private _previousRelativeLocation: number[] = [];
    private _currentRelativeLocation: number[] = [];
    private _previousRealLocation: number[] = [];
    private _currentRealLocation: number[] = [];
    private _gridScale: number[] = [1, 1, 1];

    public get previousRelativeLocation(): number[] {
        return this._previousRelativeLocation;
    }

    public set previousRelativeLocation(value: number[]) {
        if (value.length !== 3)
            throw new Error("Invalid location format, should be [x, y, z]");
        this._previousRelativeLocation = value;
    }

    public get currentRelativeLocation(): number[] {
        return this._currentRelativeLocation;
    }

    public set currentRelativeLocation(value: number[]) {
        if (value.length !== 3)
            throw new Error("Invalid location format, should be [x, y, z]");
        this._currentRelativeLocation = value;
    }

    public get previousRealLocation(): number[] {
        return this._previousRealLocation;
    }

    public set previousRealLocation(value: number[]) {
        if (value.length !== 3)
            throw new Error("Invalid location format, should be [x, y, z]");
        this._currentRealLocation = value;
    }

    public get currentRealLocation(): number[] {
        return this._currentRealLocation;
    }

    public set currentRealLocation(value: number[]) {
        if (value.length !== 3)
            throw new Error("Invalid location format, should be [x, y, z]");
        this._currentRealLocation = value;
    }

    public get gridScale(): number[] {
        this.iterateGridScale();
        return this._gridScale;
    }

    private iterateGridScale = () => {
        let checkList = [
            this._previousRelativeLocation,
            this._currentRelativeLocation,
            this._previousRealLocation,
            this._currentRealLocation
        ];

        checkList.forEach(locationData => {
            if (locationData.length !== 3)
                throw new Error("Some location data not initialized");
        });

        let diffRel = [
            this._currentRelativeLocation[0] -
                this._previousRelativeLocation[0],
            this._currentRelativeLocation[1] -
                this._previousRelativeLocation[1],
            this._currentRelativeLocation[2] - this._previousRelativeLocation[2]
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
    };
}
