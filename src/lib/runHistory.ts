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
export default class RunHistory {
    private store = new Store<AppStorage>();
    private maxRuns = 5; // TODO LATER: get that from the settings

    constructor() {
        this.show();
    }

    private show(): void {
        const { history } = this.store.store;
        console.log(`The history currently contains ${history.length} run(s).`);
    }

    public addRun(key: HistoryKey, result: SRToolResult): void {
        const { history } = this.store.store;

        console.log('Saving to history');
        this.show();
        history.push({key, result})
        while (history.length > this.maxRuns) {
            history.shift()
        }
        this.store.set('history', history)
        this.show();
    }

    public clear(): void {
        // TODO LATER: 
        this.show();
        console.log('Clearing history');
        this.store.reset('history')
        this.show();
    }
}
