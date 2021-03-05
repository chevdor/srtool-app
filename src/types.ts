import { HistoryData } from "./lib/runHistory";
import { Settings } from "./lib/settings";

export type Version = string | null;

export type AppStorage = {
    settings: Settings,
    history: HistoryData
}

/**
 * A Runtime Package, for instance `polkadot-runtime`.
 */
export type RuntimePackage = string;
