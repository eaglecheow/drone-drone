import { ObstacleCategory, GridHelper } from "../layergeneration";

export class DataParser {
    public static stringToGrid = (
        tcpString: string,
        gridSize: [number, number]
    ): ObstacleCategory => {
        const stringArray = tcpString.split(",");
        const numberArray = stringArray.map(stringValue =>
            parseFloat(stringValue)
        );

        let gridTemplate = GridHelper.generateGrid([gridSize[1], gridSize[0]], 0);

        // console.log("Grid Template: ", gridTemplate);

        let row = 0;
        let column = 0;

        for (let i = 0; i < numberArray.length - 1; i++) {
            gridTemplate[row][column] = numberArray[i];
            column++;
            if (column > gridTemplate[0].length - 1) {
                column = 0;
                row++;
            }
        }

        let obstacleCategory = new ObstacleCategory();
        obstacleCategory.level1 = gridTemplate[0];
        obstacleCategory.level2 = gridTemplate[1];
        obstacleCategory.level3 = gridTemplate[2];

        // console.log("Obstacle Category: ", obstacleCategory);

        return obstacleCategory;
    };

    /** DEPRECATED */
    // /**
    //  * Parses TCP string to obstacle data readable for the script
    //  * @param tcpString Input TCP string
    //  */
    // static stringToObstacle = (tcpString: string): ObstacleCategory => {
    //     let obstacleCategory = new ObstacleCategory();

    //     const layerStringArray = tcpString.split("+");
    //     layerStringArray.forEach(layerString => {
    //         const obstacleCollectionString = layerString.slice(
    //             2,
    //             layerString.length - 1
    //         );
    //         const obstacleStringArray = obstacleCollectionString.split(":");
    //         const obstacleArray = obstacleStringArray.map(stringValue => {
    //             const filteredStringValue = stringValue.slice(
    //                 0,
    //                 stringValue.length - 1
    //             );
    //             const dataArray = filteredStringValue.split(",");

    //             // const xAxis = parseFloat(dataArray[0]);
    //             // const yAxis = parseFloat(dataArray[1]);
    //             // const zAxis = parseFloat(dataArray[2]);
    //             const xzDistance = parseFloat(dataArray[0]);
    //             const angle = parseFloat(dataArray[1]);

    //             return [xzDistance, angle];
    //         });

    //         const layerCharacter = layerString[0];
    //         if (layerCharacter === "H") {
    //             obstacleCategory.level1 = obstacleArray;
    //         } else if (layerCharacter === "M") {
    //             obstacleCategory.level2 = obstacleArray;
    //         } else if (layerCharacter === "L") {
    //             obstacleCategory.level3 = obstacleArray;
    //         } else {
    //             console.warn(
    //                 `Invalid layer character detected, please check TCP string [layerCharacter = ${layerCharacter}]`
    //             );
    //         }
    //     });

    //     return obstacleCategory;
    // };
}
