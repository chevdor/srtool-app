import os from 'os';
import { Package } from '../types';
import * as Path from 'path'
import { folderBase } from '../constants';

export interface SettingSetter {
    set: (section: string, key: string, value: any) => void;
}

export interface Settings {
    local: {
        /** This flag defines how/if the source is provided.
         * - httpGet: srtool-app does fetch the source into a temp folder and sets `projectPath` accordingly
         * - user: The user manages the source using a manual zip download or git
         *
         * When using `httpGet`, `autoCleanup` will be set to true.
         * When using `user`, `autoCleanup` will be force to false (we don't want to wipe the user's repo!)
         */
        fetchMode: "httpGet" | "user";

        /**
         * This is the global temp folder we are using. Nothing should be exported here
         * and the content should be considered transient.
         */
        workDir: string;

        /**
         * This is the local path where the source to build is located.
         * The source may come from the user (using git or download),
         * or have been downloaded by us. In `httpGet` mode, this is
         * a folder under the `workDir`.
         */
        projectPath: string;

        /**
         * This is the path where we export the runtime we generated.
         */
        exportFolder: string;

        /** Whether or not we wipe the source after a successful run.
         * This will never be the case when `fetchMode` is set to `user`.
         */
        autoCleanup: boolean;

        /**
         * How many of the last runs do we keep
         */
        historyLimit: number;
    };
    repo: {
        /** This is the repo we pull the source from. For instance:
         * https://github.com/paritytech/substrate
         */
        baseUrl: string;

        /** The tag we will be using */
        tag: string;

        /** The package to build. ie polkadot-runtime, kusama-runtime, etc.... */
        package: Package;
    };
    srtool: {
        /** When set to the default (true), the srtool-app
         * will automatically switch to the latest srtool as new versions
         * are found. If you prefer to use a specific version, you need to set it
         * to false.
         */
        autoUpgrade: boolean;

        /** If `autoUpgrade` is true, this value will be managed by the app.
         * Otherwise, we take the value set by the user.
         */
        image: string;

    };
    runner: {}
};


export type SettingsContextContent = Settings & SettingSetter;

export const defaultSettings: SettingsContextContent = {
    local: {
        fetchMode: "httpGet",
        workDir: Path.join(os.tmpdir(), folderBase),
        projectPath: Path.join(os.tmpdir(), folderBase), // Not ideal but good enough as a started until we know more
        exportFolder: Path.join(os.homedir(), folderBase),
        autoCleanup: true,
        historyLimit: 30,
    },
    repo: {
        baseUrl: "https://github.com/paritytech/polkadot",
        tag: "v0.8.28",
        package: 'polkadot-runtime'
    },
    srtool: {
        autoUpgrade: true,
        image: "chevdor/srtool:nightly-2021-02-25",
    },
    runner: {},
    set: (a, b) => { },
};
