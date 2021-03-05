import { expect } from 'chai';
import { DockerSystemInfo } from '../src/components/dockerStatus';
import 'mocha';
import docker from '../src/lib/dockerapi'

describe('dockerapi', () => {
  it('should get system info', async function () {
    
    const info: DockerSystemInfo = await docker.info();
    expect(info.NCPU).greaterThan(0);
    expect(info.MemTotal).greaterThan(0);
  });

  it('should get the containers', async function () {
    const containers = await docker.listContainers();
    console.log('containers', containers);   
    expect(containers).is.not.null;
  });

  it('should get the srtool container', async function () {
    const containers = await docker.listContainers();
    const srtool = containers.find( c => c.Names.includes('/srtool'))
    console.log('srtool', srtool);   
  });
});
