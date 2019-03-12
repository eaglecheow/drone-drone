import { GlobalObstacleGrid } from "../layergeneration/GlobalObstacleGrid";
import PathFinding from "pathfinding";

export class LocalLevelFinder {
    private _localLevelGrid: GlobalObstacleGrid;
    private _relativePath: number[][] = [];
    private _globalPath: number[][] = [];

    public get localLevelGrid(): GlobalObstacleGrid {
        return this._localLevelGrid;
    }

    public set localLevelGrid(value: GlobalObstacleGrid) {
        this._localLevelGrid = value;
        this.findRelativePath();
        this.matchRelativePathToGlobal();
    }

    public get relativePath(): number[][] {
        return this._relativePath;
    }

    public get globalPath(): number[][] {
        return this._globalPath;
    }

    constructor(localLevelGrid: GlobalObstacleGrid) {
        this._localLevelGrid = localLevelGrid;
        this.findRelativePath();
        this.matchRelativePathToGlobal();
    }

    /**
     * Finds relative path by searching for furthest possible distance to fly
     */
    private findRelativePath(): void {
        let relativeGrid = this._localLevelGrid.relativeGrid;
        let targetPoint = [0, 0];

        //Find furthest possible point
        for (let i = 0; i < relativeGrid.length; i++) {
            for (let j = 0; j < relativeGrid[i].length; j++) {
                if (relativeGrid[i][j] === 0) {
                    targetPoint = [j, i];
                }
            }
        }

        //Set path points
        const startPointX = Math.floor(relativeGrid[0].length / 2);
        const startPointZ = 0;
        const endPointX = targetPoint[0];
        const endPointZ = targetPoint[1];

        //Find path
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

    /**
     * Matchs relative path to global
     */
    private matchRelativePathToGlobal(): void {
        let relativePath = this._relativePath;
        let globalGrid = this._localLevelGrid.globalGrid;

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
