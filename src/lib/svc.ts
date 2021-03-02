// TODO: This is a tag for github, to see if we get similar with gitlab
export type Tag = {
    "ref": string,
    "node_id": string,
    "url": string,
    "object": {
        "sha": string,
        "type": 'commit' | 'tag',
        "url": string,
    }
}

// export type Service = 'github' | 'gitlab';
export type Service = 'github';

/**
 * A class to fetch information about the repo independantly from the 
 * service (gitlab/github) used.
 * NOTE: For now, we support only github.
 */
export default class SourceVersionControl {
    private _owner: string;
    private _repo: string;
    private _service: Service;

    constructor(service: Service, owner: string, repo: string) {
        this._owner = owner;
        this._repo = repo;
        this._service = service;
    }

    async getTags(): Promise<Tag[]> {
        return new Promise(async (resolve, reject) => {
            const url = `https://api.github.com/repos/${this._owner}/${this._repo}/git/matching-refs/tag`;
            // const url = `https://example.org`;
            console.log('fetching', url);
            const response = await fetch(url, {
                method: 'get',
                headers: { 'Content-Type': 'application/json' },
            });
            console.log('done', response);
            
            if (response.status === 200) {
                const json = await response.json();
                const sorted = json.reverse().slice(0, 30); // TODO: we show only the last 30, we may want a setting for that or let the user use free text
                resolve(sorted)
            } else {
                reject(new Error(`Something went wrong fetching the tags from ${url}. Status: ${response.status}`))
            }
        })
    }
}
