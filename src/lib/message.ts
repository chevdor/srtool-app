
export type Hash = string;
export type ProposalHash = Hash;

/**
 * Describes the json output as sent by srtool
 */
export type SRToolOutput = {
    gen: string,
    commit: string,
    tag: string,
    branch: string,
    tmsp: string,
    rustc: string,
    size: string,
    pkg: string,
    prop: string,
    sha256: string,
    wasm: string
};

/**
 * Those are infos coming from srtool before we need to start any (long)
 * compilation task.
 */
export type SRToolInfo = {
    generator: string,
    git: {
        commit: string,
        tag?: string,
        branch?: string,
    },
    rustc: string;
    package: string,
}

export type SRToolResult = SRToolInfo & {
    time: Date, // date of the generation of the result
    duration?: number; // in ms
    size: number; // in bytes
    proposalHash: ProposalHash;
    sha256: Hash;
    wasm: {
        path: string;
        // content: Buffer;  // srtool currently does not provide this
        // preview: string;
    }
};
export type OutputMessage = string;

export type Message = {
    received: Date,
    // type: 'output' | 'result',
    content: OutputMessage | SRToolResult
};

/**
 * Return whether m is a SRToolResult or not.
 * @param m 
 */
export function isResult(m: OutputMessage | SRToolResult): m is SRToolResult {
    return (<SRToolResult>m).generator !== undefined;
}

/**
 * Running srtool build --json currently returns
 * {
 *    "gen": "srtool v0.9.5",
 *    "commit": "371681c298eb96b74ad04a09ca8097f19c777e68",
 *    "tag": "v0.8.28",
 *    "branch": "heads/v0.8.28",
 *    "tmsp": "2021-02-24T11:02:36Z",
 *    "rustc": "rustc 1.49.0-nightly (fd542592f 2020-10-26)",
 *    "size": "2151335",
 *    "pkg": "polkadot-runtime",
 *    "prop": "0x8e2a831f00c994558f75a7a4ef1d71d173a87365079280952ec2a4b56a36275b",
 *    "sha256": "887c755518ead3af05e95d0db16473e26a4bdcfd9ca4d45db88144bd10db26c1",
 *    "wasm": "./target/srtool/release/wbuild/polkadot-runtime/polkadot_runtime.compact.wasm"
 *  }
 */
export class SRToolResultBuilder {
    public static build(res: SRToolOutput): SRToolResult {
        const result = {
            generator: res.gen,
            git: {
                commit: res.commit,
                tag: res.tag,
                branch: res.branch,
            },
            time: new Date(res.tmsp), // date of the generation of the result
            // duration?: number; // in ms, not provided by srtool
            rustc: res.rustc,
            size: parseInt(res.size), // in bytes
            package: res.pkg,
            proposalHash: res.prop,
            sha256: res.sha256,
            wasm: {
                path: res.wasm,
                // content: Buffer;  // srtool currently does not provide this
                // preview: res.;    // srtool currently does not provide this
            }
        }
        return result;
    }
}

export class MessageBuilder {
    public static build(s: string): Message {
        try {
            const output: SRToolOutput = JSON.parse(s);
            const content = SRToolResultBuilder.build(output);
            return {
                received: new Date(),
                content,
            }
        } catch (e) {
            return {
                received: new Date(),
                content: s,
            }
        }
    }
}
