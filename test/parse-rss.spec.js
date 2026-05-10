const { expect } = require('chai');

const GET_URL_PATH = require.resolve('../src/utils/get-url');
const PARSE_RSS_PATH = require.resolve('../src/utils/parse-rss');

const withXML = (xml) => {
  require.cache[GET_URL_PATH] = {
    id: GET_URL_PATH, filename: GET_URL_PATH, loaded: true,
    exports: { getURL: async () => xml },
  };
  delete require.cache[PARSE_RSS_PATH];
  return require('../src/utils/parse-rss').parseRSS;
};

afterEach(() => {
  delete require.cache[GET_URL_PATH];
  delete require.cache[PARSE_RSS_PATH];
});

describe('parseRSS', () => {
  it('extracts title, link and pubDate from each item', async () => {
    const parseRSS = withXML(`<rss><channel>
      <item>
        <title>Item One</title>
        <link>https://example.com/1</link>
        <pubDate>Mon, 01 Jan 2024 00:00:00 +0000</pubDate>
      </item>
      <item>
        <title>Item Two</title>
        <link>https://example.com/2</link>
        <pubDate>Tue, 02 Jan 2024 00:00:00 +0000</pubDate>
      </item>
    </channel></rss>`);

    const items = await parseRSS('http://x.test/feed');
    expect(items).to.have.length(2);
    expect(items[0]).to.deep.equal({
      title: 'Item One',
      link: 'https://example.com/1',
      pubDate: 'Mon, 01 Jan 2024 00:00:00 +0000',
    });
    expect(items[1].title).to.equal('Item Two');
  });

  it('unwraps CDATA sections', async () => {
    const parseRSS = withXML(`<rss><channel>
      <item>
        <title><![CDATA[Title & <Special> Chars]]></title>
        <link>https://example.com/1</link>
        <pubDate>Mon, 01 Jan 2024 00:00:00 +0000</pubDate>
      </item>
    </channel></rss>`);

    const items = await parseRSS('http://x.test/feed');
    expect(items[0].title).to.equal('Title & <Special> Chars');
  });

  it('returns an empty array when there are no items', async () => {
    const parseRSS = withXML(`<rss><channel></channel></rss>`);
    const items = await parseRSS('http://x.test/feed');
    expect(items).to.deep.equal([]);
  });

  it('preserves Ukrainian Cyrillic text (plain)', async () => {
    const parseRSS = withXML(`<rss><channel>
      <item>
        <title>Львівський метрополітен відкрито!</title>
        <link>https://metro.lviv.ua/news/1-lvivskyi-metropoliten.html</link>
        <pubDate>Sun, 30 Apr 2023 11:18:42 +0300</pubDate>
      </item>
    </channel></rss>`);

    const items = await parseRSS('http://x.test/feed', 'cp1251');
    expect(items[0]).to.deep.equal({
      title:   'Львівський метрополітен відкрито!',
      link:    'https://metro.lviv.ua/news/1-lvivskyi-metropoliten.html',
      pubDate: 'Sun, 30 Apr 2023 11:18:42 +0300',
    });
  });

  it('preserves Ukrainian Cyrillic text inside CDATA', async () => {
    const parseRSS = withXML(`<rss><channel>
      <item>
        <title><![CDATA[Стівен Кінг відвідав книгарню у Львівському метро]]></title>
        <link>https://metro.lviv.ua/news/204-stiven-king.html</link>
        <pubDate>Sun, 06 Nov 2022 00:13:10 +0200</pubDate>
      </item>
    </channel></rss>`);

    const items = await parseRSS('http://x.test/feed', 'cp1251');
    expect(items[0].title).to.equal('Стівен Кінг відвідав книгарню у Львівському метро');
  });

  it('returns empty string for absent fields', async () => {
    const parseRSS = withXML(`<rss><channel>
      <item>
        <title>Only Title</title>
      </item>
    </channel></rss>`);

    const items = await parseRSS('http://x.test/feed');
    expect(items[0].link).to.equal('');
    expect(items[0].pubDate).to.equal('');
  });
});
