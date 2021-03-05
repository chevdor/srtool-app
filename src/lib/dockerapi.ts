import Docker from "dockerode";
const isWindows = process.platform === "win32";

let options = isWindows ? {
    host: '127.0.0.1',
    port: 2375
} : {
    socketPath: '/var/run/docker.sock'
}

const docker = new Docker(options);
export default docker;
