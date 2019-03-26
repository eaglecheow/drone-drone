import { DataParser } from "../helper/DataParser";
import { Finder } from "../pathfinding/Finder";
import { ObstacleCategory } from "../layergeneration";
import { ServiceLayer } from "../index";
import { devConfig } from "../config";
import { KeyframeHelper } from "../helper/KeyframeHelper";
import { MapScale } from "../layergeneration/MapScale";
import { TcpStringGenerator } from "../helper/TcpStringGenerator";

const exampleString4 =
    "0,0.968517,0,0.770111,0.385994,0.896283,0.919713,0.936407,0.932002,0.926296,1.11689,1.30847,1.16218,1.19196,1.26318,";

const serviceLayerTest = () => {
    ServiceLayer.currentBearing = 12;
    ServiceLayer.currentLocation = devConfig.currentLocation;
    ServiceLayer.endLocation = [devConfig.endLocation];

    let keyFrameHelper = new KeyframeHelper();
    keyFrameHelper.currentRealLocation = [2, 2, 2];
    keyFrameHelper.currentRelativeLocation = [0.9, 0.9, 0.9];

    keyFrameHelper.currentRealLocation = [3, 3, 3];
    keyFrameHelper.currentRelativeLocation = [1.2, 1.2, 1.2];

    console.log("keyFrameHelper.gridScale", keyFrameHelper.gridScale);
    console.log("keyFrameHelper.isInit", keyFrameHelper.isInit);

    console.log("ServiceLayer.isInit: ", ServiceLayer.isInit);

    ServiceLayer.keyframeHelper = keyFrameHelper;

    ServiceLayer.startLocation = [2.943999, 101.876484];
    ServiceLayer.endLocation = [[2.943999, 101.876484]];

    console.log("ServiceLayer.isInit: ", ServiceLayer.isInit);

    ServiceLayer.init();

    console.log("ServiceLayer.isInit: ", ServiceLayer.isInit);
};

serviceLayerTest();
