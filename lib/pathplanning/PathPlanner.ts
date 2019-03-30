import { Path } from "./Path";

export class PathPlanner {
    private _startPoint: number[];
    private _endPointList: number[][];
    private _pathList: Path[] = [];
    private _currentPoint: number[];
    private _currentPath: Path;
    private _currentPathIndex: number = 0;

    public get startPoint(): number[] {
        return this._startPoint;
    }

    public get endPointList(): number[][] {
        return this._endPointList;
    }

    public get pathList(): Path[] {
        return this._pathList;
    }

    public get currentPoint(): number[] {
        return this._currentPoint;
    }

    public get currentPath(): Path {
        return this._currentPath;
    }

    public get currentPathIndex(): number {
        return this._currentPathIndex;
    }

    /**
     * Creates a new PathPlanner object
     * @param startPoint Starting point of the planned path (coordinate)
     * @param endPointList Designated endpoints for the drone to fly (list of coordinates)
     */
    constructor(startPoint: number[], endPointList: number[][]) {
        this._startPoint = startPoint;
        this._endPointList = endPointList;
        this._currentPoint = startPoint;

        this._pathList[0] = new Path(this._startPoint, this._endPointList[0]);

        for (let i = 1; i < this._endPointList.length; i++) {
            this._pathList[i] = new Path(
                this._endPointList[i - 1],
                this._endPointList[i]
            );
        }

        this._currentPath = this._pathList[this._currentPathIndex];
    }

    /**
     * Switches the current path to the next path
     */
    public switchToNextPath = () => {
        this._currentPathIndex++;
        this._currentPath = this._pathList[this._currentPathIndex];
    };

    /**
     * Checks the placing of current location in the planned path, and changes to next path
     * when current point is in the end of current path
     * @param currentPoint Current coordinate of the drone
     */
    public updateCurrentPoint = (currentPoint: number[]) => {
        let pointCheck = this._currentPath.checkPointInPath(currentPoint);
        if (pointCheck.isInBound) {
            if (pointCheck.pointLocation === "end") {
                this.switchToNextPath();
            }
        }
    };
}
