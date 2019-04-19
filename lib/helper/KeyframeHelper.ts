import { config } from "../config";
import fs from "fs";

export class KeyframeHelper {
    private _isInit: boolean = false;
    private _acceptRealLoc: boolean = false;
    private _previousRelativeLocation: number[] = [];
    private _currentRelativeLocation: number[] = [];
    private _previousRealLocation: number[] = [];
    private _currentRealLocation: number[] = [];
    private _gridScale: number[] = [1, 1, 1];
    private _scaleCollection: number[][] = [];

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

    public get acceptRealLoc(): boolean {
        return this._acceptRealLoc;
    }

    public get previousRelativeLocation(): number[] {
        return this._previousRelativeLocation;
    }

    public get currentRelativeLocation(): number[] {
        return this._currentRelativeLocation;
    }

    public set currentRelativeLocation(value: number[]) {
        if (value.length !== 3) {
            console.log("Invalid location format, should be [x, y, z]");
            return;
        }

        if (this._acceptRealLoc) return;

        let isArrayEqual = true;

        for (let i = 0; i < value.length; i++) {
            if (value[i] !== this._currentRelativeLocation[i])
                isArrayEqual = false;
        }

        if (isArrayEqual) return;

        if (this._currentRelativeLocation.length === 3) {
            this._previousRelativeLocation = this._currentRelativeLocation;
            this.initStatus.previousRelLoc = true;
        }

        this.initStatus.currentRelLoc = true;
        this._currentRelativeLocation = value;
        this._acceptRealLoc = true;
    }

    public get previousRealLocation(): number[] {
        return this._previousRealLocation;
    }

    public get currentRealLocation(): number[] {
        return this._currentRealLocation;
    }

    public set currentRealLocation(value: number[]) {
        if (value.length !== 3) {
            console.log("Invalid location format, should be [x, y, z]");
            return;
        }

        if (!this._acceptRealLoc) return;

        let isArrayEqual = true;

        for (let i = 0; i < value.length; i++) {
            if (value[i] !== this._currentRealLocation[i]) isArrayEqual = false;
        }

        if (isArrayEqual) return;

        if (this._currentRealLocation.length === 3) {
            this._previousRealLocation = this._currentRealLocation;
            this.initStatus.previousRealLoc = true;
        }

        this.initStatus.currentRealLoc = true;
        this._currentRealLocation = value;
        this._acceptRealLoc = false;
    }

    public get gridScale(): number[] {
        this.iterateGridScale();
        fs.appendFile(
            "/home/jiaming/Desktop/gridScaleLog.txt",
            `${this._gridScale[0]}, ${this._gridScale[1]}, ${
                this._gridScale[2]
            }` + "\n",
            err => {
                if (err) throw new Error(err.message);
            }
        );
        return this._gridScale;
    }

    private iterateGridScale = () => {
        if (this.isInit) {
            if (config.forceDefaultGridScale) {
                this._gridScale = config.defaultGridScale.map(element =>
                    Math.abs(element)
                );
                return;
            }

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

            console.log(
                "this._currentRelativeLocation: ",
                this._currentRelativeLocation
            );
            console.log(
                "this._previousRelativeLocation: ",
                this._previousRelativeLocation
            );

            console.log(
                "this._currentRealLocation: ",
                this._currentRealLocation
            );
            console.log(
                "this._previousRealLocation: ",
                this._previousRealLocation
            );

            console.log("diffRel: ", diffRel);
            console.log("diffReal: ", diffReal);

            let scale = [
                diffReal[0] / diffRel[0],
                diffReal[1] / diffRel[1],
                diffReal[2] / diffRel[2]
            ];

            let xArray = this._scaleCollection.map(
                scaleCollection => scaleCollection[0]
            );
            let yArray = this._scaleCollection.map(
                scaleCollection => scaleCollection[1]
            );
            let zArray = this._scaleCollection.map(
                scaleCollection => scaleCollection[2]
            );

            let xAverage =
                [scale[0], ...xArray].reduce((a, b) => a + b) /
                (xArray.length + 1);
            let yAverage =
                [scale[1], ...yArray].reduce((a, b) => a + b) /
                (yArray.length + 1);
            let zAverage =
                [scale[2], ...zArray].reduce((a, b) => a + b) /
                (zArray.length + 1);

            for (let i = 0; i < scale.length; i++) {
                if (
                    scale[i] < config.minAllowedGridScale[i] ||
                    config.maxAllowedGridScale[i] < scale[i]
                ) {
                    return;
                }
            }

            console.log([scale[0], ...xArray]);
            console.log(xArray.length + 1);
            console.log([scale[0], ...xArray].reduce((a, b) => a + b));
            console.log("xAverage: ", xAverage);
            console.log("yAverage: ", yAverage);
            console.log("zAverage: ", zAverage);

            console.log("xArray.length: ", xArray.length);

            this._gridScale = [xAverage, yAverage, zAverage].map(item =>
                Math.abs(item)
            );
            console.log("this._gridScale_1: ", this._gridScale);
            if (this._scaleCollection.length > 5) {
                this._scaleCollection.shift();
            }
            this._scaleCollection.push(this._gridScale);

            // this._gridScale = scale.map(item => Math.abs(item));
        } else {
            console.warn("KeyframeHelper not initialized");
        }
    };
}
