import { Settings } from "./settings";

export type Hash = string;

export type Result = {
    settings: Settings;
    proposalHash: Hash;
    timestamp: Date;
}