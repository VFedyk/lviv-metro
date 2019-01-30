const { expect } = require('chai');

describe('Ultimate question of Lviv, the Universe and Everything:', () => {
  it('metro should not be built', () => {
    const isMetroBuilt = false;
    expect(isMetroBuilt, 'Metro is not built').to.be.false;
  });
});
