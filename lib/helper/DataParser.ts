import { ObstacleCategory, GridHelper } from "../layergeneration";

export class DataParser {
    /**
     * Parses a TCP string into Grid data
     * @param tcpString TCP String to be parsed
     * @param gridSize The expected grid size of the input data
     */
    public static stringToGrid(
        tcpString: string,
        gridSize: number[]
    ): ObstacleCategory {
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
    }

    /**
     * Converts keyframe TCP from perception layer to relative x, y, z
     * @param tcpString TCP string to convert
     */
    public static stringToKeyFrame(
        tcpString: string
    ): {
        x: number;
        y: number;
        z: number;
    } {
        console.log("tcpString: ", tcpString);
        let inputString = tcpString.substring(0, tcpString.length - 1);
        inputString = inputString.replace("K:", "");
        let stringArray = inputString.split(",");

        if (stringArray.length !== 3)
            throw new Error("Invalid Keyframe TCP String");

        let result = {
            x: parseFloat(stringArray[0]),
            y: parseFloat(stringArray[1]),
            z: parseFloat(stringArray[2])
        };

        return result;
    }

    public static stringToDroneKeyframe(
        keyframeString: string
    ): {
        x: number;
        y: number;
        z: number;
    } {
        let dataString = keyframeString.substring(11);
        let dataArray = dataString.split(",");

        let gpsData = dataArray[0]
            .split("@")
            .map(dataItem => parseFloat(dataItem));
        let nedData = dataArray[1]
            .split("@")
            .map(dataItem => parseFloat(dataItem));
        let heading = parseFloat(dataArray[2]);

        return {
            x: nedData[1],
            y: nedData[0],
            z: nedData[2]
        };
    }

    public static stringToWaypoint(
        waypointString: string
    ): {
        startPoint: number[];
        endPoints: number[][];
    } {
        let dataString = waypointString.substring(5);
        let wayPoints = dataString.split(",").map(coordinateString => {
            let coordinateItems = coordinateString.split("@");
            return [
                parseFloat(coordinateItems[0]),
                parseFloat(coordinateItems[1])
            ];
        });

        return {
            startPoint: wayPoints[0],
            endPoints: wayPoints.splice(1, wayPoints.length - 1)
        };
    }

    public static stringToCurrentLocation(
        currentLocationString: string
    ): {
        coordinate: number[];
        altitude: number;
        heading: number;
        flightLevel: number;
    } {
        let data = currentLocationString
            .substring(6)
            .split("@")
            .map(dataItem => parseFloat(dataItem));

        return {
            coordinate: [data[0], data[1]],
            altitude: data[2],
            heading: data[3],
            flightLevel: data[4]
        };
    }
}
