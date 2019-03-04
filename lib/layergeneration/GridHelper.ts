export class GridHelper {
    public static generateGrid = <T>(
        gridSize: [number, number],
        initItem: T
    ) => {
        let gridTemplate: T[][] = [];
        for (let i = 0; i < gridSize[1]; i++) {
            gridTemplate[i] = [];
            for (let j = 0; j < gridSize[0]; j++) {
                gridTemplate[i].push(initItem);
            }
        }

        return gridTemplate;
    };
}
