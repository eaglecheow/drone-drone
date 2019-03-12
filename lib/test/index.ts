import { DataParser } from "../helper/DataParser";
import { Finder } from "../pathfinding/Finder";

const exampleString4 =
    "0,0.968517,0,0.770111,0.385994,0.896283,0.919713,0.936407,0.932002,0.926296,1.11689,1.30847,1.16218,1.19196,1.26318,";

// const printObstacleGrid = (obstacleGrid: number[][][]): void => {
//     for (let i = 0; i < obstacleGrid.length; i++) {
//         for (let j = 0; j < obstacleGrid[0].length; j++) {
//             process.stdout.write(`[${obstacleGrid[i][j].toString()}]`);
//         }
//         console.log();
//     }
// };

export const codeTest = (stringData: string = exampleString4) => {


    let obstacleCategory = DataParser.stringToGrid(stringData, [3, 5]);

    let finder = new Finder(obstacleCategory);

    console.log("finder.targetPathLevel: ", finder.targetPathLevel);
    console.log("finder.targetPathGlobal: ", finder.targetPathGlobal);
    console.log("finder.targetPathRelative: ", finder.targetPathRelative);

    // let verticleFinder = new VerticleFinder(obstacleCategory);

    // console.log(
    //     "verticleFinder.resultPath.obstacleGrid.relativeGrid: ",
    //     verticleFinder.resultPath.obstacleGrid.relativeGrid
    // );
    // console.log(
    //     "verticleFinder.resultPath.globalPath: ",
    //     verticleFinder.resultPath.globalPath
    // );
    // console.log("verticleFinder.resultLevel: ", verticleFinder.resultLevel);
};
