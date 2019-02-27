import { ObstacleCategory } from "../layergeneration";

export class DataParser {
    static stringToObstacle = (tcpString: string): ObstacleCategory => {
        let obstacleCategory = new ObstacleCategory();

        const layerStringArray = tcpString.split("|");
        layerStringArray.forEach(layerString => {
            const obstacleCollectionString = layerString.slice(
                2,
                layerString.length - 1
            );
            const obstacleStringArray = obstacleCollectionString.split(":");
            const obstacleArray = obstacleStringArray.map(stringValue => {
                const filteredStringValue = stringValue.slice(
                    0,
                    stringValue.length - 1
                );
                const dataArray = filteredStringValue.split(",");

                // const xAxis = parseFloat(dataArray[0]);
                // const yAxis = parseFloat(dataArray[1]);
                // const zAxis = parseFloat(dataArray[2]);
                const xzDistance = parseFloat(dataArray[3]);
                const angle = parseFloat(dataArray[4]);

                return [xzDistance, angle];
            });

            const layerCharacter = layerString[0];
            if (layerCharacter === "H") {
                obstacleCategory.level1 = obstacleArray;
            } else if (layerCharacter === "M") {
                obstacleCategory.level2 = obstacleArray;
            } else if (layerCharacter === "L") {
                obstacleCategory.level3 = obstacleArray;
            } else {
                console.warn(
                    `Invalid layer character detected, please check TCP string [layerCharacter = ${layerCharacter}]`
                );
            }
        });

        return obstacleCategory;
    };
}