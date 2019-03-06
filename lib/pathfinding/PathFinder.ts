import PathFinding from "pathfinding";
import { GlobalObstacleGrid } from "../layergeneration";

export class PathFinder {
    private _obstacleGrid: GlobalObstacleGrid;
    private _relativePath: number[][] = [];
    private _globalPath: number[][] = [];

    public get obstacleGrid(): GlobalObstacleGrid {
        return this._obstacleGrid;
    }

    public set obstacleGrid(value: GlobalObstacleGrid) {
        this._obstacleGrid = value;
    }

    public get relativePath(): number[][] {
        return this._relativePath;
    }

    public get globalPath(): number[][] {
        return this._globalPath;
    }

    constructor(obstacleGrid: GlobalObstacleGrid) {
        this._obstacleGrid = obstacleGrid;
    }

    private findRelativePath(): void {
        const relativeGrid = this._obstacleGrid.relativeGrid;
        const startPointX = Math.floor(relativeGrid[0].length / 2);
        const startPointZ = 0;
        const endPointX = startPointX;
        const endPointZ = relativeGrid.length - 1;

        let grid = new PathFinding.Grid(relativeGrid);
        let finder = new PathFinding.AStarFinder();

        let path = finder.findPath(
            startPointX,
            startPointZ,
            endPointX,
            endPointZ,
            grid
        );

        this._relativePath = path;
    }

    private matchRelativePathToGlobal(): void {

        

        throw new Error("Not Implemented");
    }
}
