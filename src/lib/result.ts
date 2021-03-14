import { SRToolResult } from "./message";
import { Settings } from "./settings";

export type Result = {
    settings: Settings;
    result: SRToolResult;
    timestamp: Date;
}
