import { DataParser } from "./helper/DataParser";
import { Finder } from "./pathfinding/Finder";
import { devConfig } from "./config";

export const iterate = (stringData: string, callback: Function) => {
    if (stringData.length <= 0) return;

    let obstacleCategory = DataParser.stringToGrid(stringData, [3, 5]);
    let finder = new Finder(obstacleCategory);

    callback(finder);
};

interface ScaleValue {
    gridSize: [number, number];
    rangeMin: [number, number];
    rangeMax: [number, number];
    currentLocation: [number, number];
    referenceDistance: number;
    referenceBearing: number;
}

export class ServiceLayer {
    //Default value, must be changed upon init
    static scaleValue: ScaleValue = devConfig;

    /**
     * Initialization Process of Service Layer
     * 1. Check for keyframe and perform calculation for scaling purpose
     * 2. Adjust scale value
     * 3. 
     */
    public static init = () => {
        //TODO: Write init implementation
    }

    public static adjustScaleValue = () => {
        ServiceLayer.scaleValue.gridSize = [2, 2];
    };
}
