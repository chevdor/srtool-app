import { Settings } from "./contexts/settingsContext";
import { HistoryData } from "./lib/history";

export type Version = string | null;

export type AppStorage = {
    settings: Settings,
    history: HistoryData
}
