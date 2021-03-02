import { AppStorage, Version } from "../types";
import { SRToolResult } from "./message";
import Store from 'electron-store';

export type HistoryKey = {
    /** Full image name, ie chevdor/srtool:nightly-2021-02-25 */
    srtoolImage: string;
    srtoolVersion: Version;
    gitCommit: string;
    date: Date;
    package: string;
}

export type HistoryDataItem = {
    key: HistoryKey,
    result: SRToolResult,
}

export type HistoryData = HistoryDataItem[];

/**
 * Allows storing, loading and searching previous runs.
 * it also allows not having to run again for a result we already have.
 */
export default class History {
    private _data : HistoryData;

    constructor() {
        const store = new Store<AppStorage>();
        this._data = store.store.history;
        console.log(`The history contains ${this._data.length} run(s).`);
    }

    public save(key: HistoryKey, data: SRToolResult):void {

    }

    // to be continued

}