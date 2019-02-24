import { ObstacleCategory } from "../layergeneration/index";

export const tcpMessageParser = (tcpString: string): ObstacleCategory => {
    const layer = tcpString[0];
    let obstacleCollectionString = tcpString.slice(2, tcpString.length - 1);
    let obstacleStringArray = obstacleCollectionString.split(":");

    let obstacleArray = obstacleStringArray.map(stringValue => {
        let filteredStringValue = stringValue.slice(0, stringValue.length - 1);
        let dataArray = filteredStringValue.split(",");

        const xAxis = parseFloat(dataArray[0]);
        const yAxis = parseFloat(dataArray[1]);
        const zAxis = parseFloat(dataArray[2]);
        const xzDistance = parseFloat(dataArray[3]);
        const angle = parseFloat(dataArray[4]);

        return [xzDistance, angle];
    });

    if (layer === "H") {
        return {
            level1: obstacleArray,
            level2: [],
            level3: []
        };
    } else if (layer === "M") {
        return {
            level1: [],
            level2: obstacleArray,
            level3: []
        };
    } else if (layer === "L") {
        return {
            level1: [],
            level2: [],
            level3: obstacleArray
        };
    } else {
        return {
            level1: [],
            level2: [],
            level3: []
        };
    }
};
