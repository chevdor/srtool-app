import { expect } from 'chai';
import 'mocha';
import Runner from '../src/lib/runner';

describe('runner', () => {
  it('should get projectPath', async function () {
    const r = new Runner();    
    expect(r.settings.local.projectPath).to.have.length.greaterThan(5);
  });
});
