import { ObstacleCategory, GridHelper } from "../layergeneration";

export class DataParser {
    /**
     * Parses a TCP string into Grid data
     * @param tcpString TCP String to be parsed
     * @param gridSize The expected grid size of the input data
     */
    public static stringToGrid = (
        tcpString: string,
        gridSize: number[]
    ): ObstacleCategory => {
        const stringArray = tcpString.split(",");
        const numberArray = stringArray.map(stringValue =>
            parseFloat(stringValue)
        );

        let gridTemplate = GridHelper.generateGrid(
            [gridSize[1], gridSize[0]],
            0
        );

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

    public static stringToDroneData = (
        tcpString: string
    ): {
        startLoc: number[];
        endLoc: number[][];
        currentLoc: number[];
        currentBearing: number;
    } => {
        let dataArray = tcpString.split("/");

        let startLoc: number[] = [];
        let endLoc: number[][] = [];
        let currentLoc: number[] = [];
        let currentBearing = parseFloat(dataArray[3]);

        dataArray[0].split("@").forEach((coordinateItem, index) => {
            startLoc[index] = parseFloat(coordinateItem);
        });

        dataArray[2].split("@").forEach((coordinateItem, index) => {
            currentLoc[index] = parseFloat(coordinateItem);
        });

        dataArray[1].split(",").forEach((coordinateString, i) => {
            if (!endLoc[i]) endLoc[i] = [];
            coordinateString.split("@").forEach((coordinateItem, j) => {
                endLoc[i][j] = parseFloat(coordinateItem);
            });
        });

        return {
            startLoc,
            endLoc,
            currentLoc,
            currentBearing
        };
    };

    public static stringToKeyFrame = (
        tcpString: string
    ): {
        x: number;
        y: number;
        z: number;
    } => {
        let inputString = tcpString.replace("K:", "");
        let stringArray = inputString.split(",");

        if (stringArray.length !== 3)
            throw new Error("Invalid Keyframe TCP String");

        let result = {
            x: parseFloat(stringArray[0]),
            y: parseFloat(stringArray[1]),
            z: parseFloat(stringArray[2])
        };

        return result;
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
