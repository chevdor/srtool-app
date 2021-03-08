import { DockerVersion } from "dockerode";
import docker from './dockerapi'

// TODO: replace cli calls by https://github.com/apocas/dockerode

// TODO: swallow the dockerapi.ts here into a class

export async function getDockerVersion(): Promise<string | null> {
    let version: DockerVersion = await docker.version()
    return version.Version
}

export async function getDockerRunning(): Promise<boolean> {
    try {
        const response: Buffer = await docker.ping();
        return response.toString() === 'OK'
    } catch (e) {
        return false
    }
}