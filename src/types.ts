import { HistoryData } from "./lib/runHistory";
import { Settings } from "./lib/settings";

export type Version = string | null;

export type AppStorage = {
    settings: Settings,
    history: HistoryData
}


export type Hash = string;
export type ProposalHash = Hash;

export type KnownRuntime = 'westend-runtime' | 'kusama-runtime' | 'polkadot-runtime';
/**
 * A Runtime Package, for instance `polkadot-runtime`.
 */

export type RuntimePackage = KnownRuntime | string;