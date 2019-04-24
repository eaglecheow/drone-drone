import { LocalLevelFinder } from "../pathfinding/LocalLevelFinder";
import { GlobalObstacleGrid } from "../layergeneration";
import { Finder } from "../pathfinding/Finder";
import { DataParser } from "../helper/DataParser";
import { MapScale } from "../layergeneration/MapScale";

let obstacleCategory = DataParser.stringToGrid("18.573,19.797,1.97634,20.0304,20.3285,23.0318,10.4059,2.788,10.6897,11.3524,0,1.43265,1.93944,6.10853,0,", [3, 5]);
let mapScale = new MapScale([5, 30], [0, 0], [5, 2], [2.942662, 101.8740943], [2.942662, 101.8740943], [2.942662, 101.8740943], [5, 5, 5], 20);
let finder = new Finder(obstacleCategory, mapScale, [2.942662, 101.8740943], 2);

console.log(finder.targetPathRelative);