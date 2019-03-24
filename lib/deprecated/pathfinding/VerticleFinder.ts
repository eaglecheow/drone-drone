// import { mapGrid, RelativeObstacleGrid } from "../layergeneration";
// import { ObstacleCategory } from "../layergeneration/ObstacleCategory";
// import { GlobalObstacleGrid } from "../layergeneration/GlobalObstacleGrid";
// import { LevelPathFinder } from "./LevelPathFinder";
// import { devConfig } from "../config";

// export class VerticleFinder {
//     private _resultLevel: number;
//     private _resultPath: LevelPathFinder;
//     private _obstacleCategory: ObstacleCategory;

//     public get resultLevel(): number {
//         return this._resultLevel;
//     }

//     public get resultPath(): LevelPathFinder {
//         return this._resultPath;
//     }

//     public get obstacleCategory(): ObstacleCategory {
//         return this._obstacleCategory;
//     }

//     public set obstacleCategory(value: ObstacleCategory) {
//         this._obstacleCategory = value;
//     }

//     private iterationPath: LevelPathFinder;
//     private iterationLevelGrid: GlobalObstacleGrid;
//     private iterationLevel: number;

//     constructor(obstacleCategory: ObstacleCategory) {
//         this.iterationLevel = 2;
//         this._obstacleCategory = obstacleCategory;
//         [
//             this.iterationPath,
//             this.iterationLevelGrid
//         ] = this.generateLevelPath();

//         [this._resultLevel, this._resultPath] = this.resultLayerIteration();
//     }

//     private generateLevelPath = (): [LevelPathFinder, GlobalObstacleGrid] => {
//         let layerObstacle: number[] = [];

//         switch (this.iterationLevel) {
//             case 1: {
//                 layerObstacle = this._obstacleCategory.level1;
//                 break;
//             }
//             case 2: {
//                 layerObstacle = this._obstacleCategory.level2;
//                 break;
//             }
//             case 3: {
//                 layerObstacle = this._obstacleCategory.level3;
//                 break;
//             }
//         }

//         let globalObstacleGrid = mapGrid(
//             layerObstacle,
//             devConfig.gridSize,
//             devConfig.rangeMin,
//             devConfig.rangeMax,
//             devConfig.currentLocation,
//             devConfig.referenceDistance,
//             devConfig.referenceBearing
//         );

//         this.iterationLevelGrid = globalObstacleGrid;
//         this.iterationPath = new LevelPathFinder(this.iterationLevelGrid);

//         return [this.iterationPath, this.iterationLevelGrid];
//     };

//     private resultLayerIteration = (): [number, LevelPathFinder] => {
//         let iterationSequence = [2, 3, 1];

//         for (let i = 0; i < iterationSequence.length; i++) {
//             this.iterationLevel = iterationSequence[i];
//             [
//                 this.iterationPath,
//                 this.iterationLevelGrid
//             ] = this.generateLevelPath();

//             if (this.iterationPath.relativePath.length > 0) {
//                 this._resultLevel = this.iterationLevel;
//                 this._resultPath = this.iterationPath;
//                 break;
//             }
//         }

//         if (!this._resultPath) this._resultPath = this.iterationPath;

//         if (this._resultPath.relativePath.length <= 0) this._resultLevel = 0;

//         return [this._resultLevel, this._resultPath];
//     };
// }
