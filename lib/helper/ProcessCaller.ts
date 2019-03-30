import { exec } from "child_process";

export class ProcessCaller {
    /**
     * Launches the control layer
     * @param controlLayerLaunchPath Path of control layer launch code, from root
     */
    public static callControlLayer(controlLayerLaunchPath: string) {
        exec(`python ${controlLayerLaunchPath}`, (err, stdout, stderr) => {
            if (err) {
                console.log("err: ", err);
                process.abort();
            }
        });
    }
}
