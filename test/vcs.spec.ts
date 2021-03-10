import { expect } from 'chai';
import 'mocha';
import SourceVersionControl from '../src/lib/vcs';

describe('vcs', () => {
  it('should get the list of tags from github', async () => {
    const svc = new SourceVersionControl('github', 'paritytech', 'polkadot');
    const res = await svc.getTags(); 
    expect(res).to.have.length(30);
  });
});
