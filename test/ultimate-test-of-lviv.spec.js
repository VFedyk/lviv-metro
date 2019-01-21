const { expect } = require('chai');

describe('Ultimate question of Lviv, the Universe and Everything:', () => {
  it('Is metro built', () => {
    const isMetroBuilt = false;
    expect(isMetroBuilt, 'Metro is not built').to.be.true;
  });
});