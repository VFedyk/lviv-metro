import { expect } from 'chai';
import { getURL } from '../src/utils/get-url.js';

describe('getURL', () => {
  let originalFetch;

  beforeEach(() => { originalFetch = globalThis.fetch; });
  afterEach(() => { globalThis.fetch = originalFetch; });

  const mockFetch = (bytes) => {
    globalThis.fetch = async () => ({
      arrayBuffer: async () => new Uint8Array(bytes).buffer,
    });
  };

  it('decodes CP1251 bytes to Unicode', async () => {
    // "Метро" in CP1251: М=0xCC е=0xE5 т=0xF2 р=0xF0 о=0xEE
    mockFetch([0xCC, 0xE5, 0xF2, 0xF0, 0xEE]);
    const result = await getURL('http://x.test/', 'cp1251');
    expect(result).to.equal('Метро');
  });

  it('decodes Ukrainian-specific CP1251 characters (і ї є)', async () => {
    // "Львів" — Л=0xCB ь=0xFC в=0xE2 і=0xB3 в=0xE2
    // "їжа"  — ї=0xBF ж=0xE6 а=0xE0
    // "єдність" — є=0xBA д=0xE4 н=0xED і=0xB3 с=0xF1 т=0xF2 ь=0xFC
    mockFetch([
      0xCB, 0xFC, 0xE2, 0xB3, 0xE2, 0x20, // "Львів "
      0xBF, 0xE6, 0xE0, 0x20,              // "їжа "
      0xBA, 0xE4, 0xED, 0xB3, 0xF1, 0xF2, 0xFC, // "єдність"
    ]);
    const result = await getURL('http://x.test/', 'cp1251');
    expect(result).to.equal('Львів їжа єдність');
  });

  it('decodes UTF-8 when no encoding is specified', async () => {
    mockFetch(new TextEncoder().encode('Lviv Metro'));
    const result = await getURL('http://x.test/');
    expect(result).to.equal('Lviv Metro');
  });
});
