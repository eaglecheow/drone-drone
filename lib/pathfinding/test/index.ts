import PF from "pathfinding";

/**
 * Test the A* algorithm
 * @param testData Test data in format of [[r0c0, r0c1, ...], [r1c0, r1c1...], ...]
 */
export const testAStar = (testData: number[][]): number[][] => {

    //Check if the array dimension is correct
    const yAxisLength = testData.length;
    if (yAxisLength < 1) throw new Error("Invalid size: Y Axis");

    const xAxisLength = testData[0].length;
    if (xAxisLength < 1) throw new Error("Invalid size: X Axis");

    testData.forEach(row => {
        if (row.length !== xAxisLength)
            throw new Error("Invalid size: Not all row have same size");
    });


    //Construct the grid and perform pathfinding
    let grid = new PF.Grid(testData);

    let finder = new PF.AStarFinder();
    let path = finder.findPath(0, 0, xAxisLength - 1, yAxisLength - 1, grid);

    return path;
};
