import { expect } from 'chai';
import { getSrtoolLatestVersion } from '../src/lib/srtool';
import 'mocha';

// TODO: those fail but should pass
describe('srtool', () => {
  it('should get the latest version', async function () {
    const version = await getSrtoolLatestVersion();
    expect(version).to.equal('0.9.6');
  });
});
