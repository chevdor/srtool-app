import { expect } from 'chai';
import 'mocha';
import SourceVersionControl from 'lib/vcs';

// TODO: those fail but should pass
describe('svc', () => {
  it('should get the list of tags from github', async () => {
    const svc = new SourceVersionControl('github', 'paritytech', 'polkadot');
    const res = await svc.getTags(); 
    expect(res).to.have.length.greaterThan(30);
  });
});
