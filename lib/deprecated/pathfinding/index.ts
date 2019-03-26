import PathFinding from "pathfinding";

/**
 * Finds an available path using A* algorithm
 * @param obstacleGrid Obstacle list of the layer
 * @param startPoint Starting point of the path
 * @param endPoint Ending point of the path
 */
export const findPath = (
    obstacleGrid: number[][],
    startPoint: number[],
    endPoint: number[]
): number[][] => {
    const yAxisLength = obstacleGrid.length;
    if (yAxisLength < 1) throw new Error("Invalid size: Y Axis");

    const xAxisLength = obstacleGrid[0].length;
    if (xAxisLength < 1) throw new Error("Invalid size: X Axis");

    obstacleGrid.forEach(row => {
        if (row.length !== xAxisLength)
            throw new Error("Invalid size: Not all row size matches");
    });

    let grid = new PathFinding.Grid(obstacleGrid);
    let finder = new PathFinding.AStarFinder();

    let path = finder.findPath(
        startPoint[0],
        startPoint[1],
        endPoint[0],
        endPoint[1],
        grid
    );

    return path;
};
