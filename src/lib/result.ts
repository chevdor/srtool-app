import { SRToolResult } from "./message";
import { Settings } from "./settings";

export type Hash = string;

export type Result = {
    settings: Settings;
    result: SRToolResult;
    timestamp: Date;
}
