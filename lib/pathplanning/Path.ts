import geolib from "geolib";
import { PathHelper } from "./PathHelper";

export class Path {
    private _startPoint: number[];
    private _endPoint: number[];

    public get startPoint(): number[] {
        return this._startPoint;
    }

    public set startPoint(value: number[]) {
        if (value.length !== 2) {
            console.warn("startPoint dimension incorrect");
            return;
        }

        this._startPoint = value;
    }

    public get endPoint(): number[] {
        return this._endPoint;
    }

    public set endPoint(value: number[]) {
        if (value.length !== 2) {
            console.warn("endPoint dimension incorrect");
            return;
        }

        this._endPoint = value;
    }

    constructor(startPoint: number[], endPoint: number[]) {
        this._startPoint = startPoint;
        this._endPoint = endPoint;
    }

    public checkPointInPath = (
        point: number[]
    ): {
        isInBound: boolean;
        pointLocation: "start" | "path" | "end" | "outside";
    } => {
        let pathPolygon = PathHelper.generatePathBound(
            this._startPoint,
            this._endPoint,
            1
        );

        let isInShapeBoundCheck: boolean[] = [
            geolib.isPointInCircle(
                {
                    latitude: point[0],
                    longitude: point[1]
                },
                {
                    latitude: this._startPoint[0],
                    longitude: this._startPoint[1]
                },
                1
            ),
            geolib.isPointInCircle(
                {
                    latitude: point[0],
                    longitude: point[1]
                },
                {
                    latitude: this._endPoint[0],
                    longitude: this._endPoint[1]
                },
                1
            ),
            geolib.isPointInside(
                {
                    latitude: point[0],
                    longitude: point[1]
                },
                pathPolygon
            )
        ];

        let isInBound = false;

        isInShapeBoundCheck.forEach(isInShapeBound => {
            if (isInShapeBound) isInBound = true;
        });

        let positionString: "start" | "path" | "end" | "outside";

        if (isInShapeBoundCheck[0]) {
            positionString = "start";
        } else if (isInShapeBoundCheck[1]) {
            positionString = "end";
        } else if (isInShapeBoundCheck[2]) {
            positionString = "path";
        } else {
            positionString = "outside";
        }

        return {
            isInBound,
            pointLocation: positionString
        };
    };
}
