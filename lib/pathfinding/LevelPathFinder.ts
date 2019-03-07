import PathFinding from "pathfinding";
import { GlobalObstacleGrid } from "../layergeneration";

export class LevelPathFinder {
    private _obstacleGrid: GlobalObstacleGrid;
    private _relativePath: number[][] = [];
    private _globalPath: number[][] = [];

    public get obstacleGrid(): GlobalObstacleGrid {
        return this._obstacleGrid;
    }

    public set obstacleGrid(value: GlobalObstacleGrid) {
        this._obstacleGrid = value;
        this.findRelativePath();
        this.matchRelativePathToGlobal();
    }

    public get relativePath(): number[][] {
        return this._relativePath;
    }

    public get globalPath(): number[][] {
        return this._globalPath;
    }

    constructor(obstacleGrid: GlobalObstacleGrid) {
        this._obstacleGrid = obstacleGrid;
        this.findRelativePath();
        this.matchRelativePathToGlobal();
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
        let relativePath = this._relativePath;
        let globalGrid = this._obstacleGrid.globalGrid;

        let globalPath: number[][] = [];

        relativePath.forEach((relativePoint, index) => {
            const indexX = relativePoint[0];
            const indexZ = relativePoint[1];

            const coordinate = globalGrid[indexZ][indexX];

            globalPath[index] = [coordinate[0], coordinate[1]];
        });

        this._globalPath = globalPath;
    }
}
