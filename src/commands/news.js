const { get } = require('http');
const { promisify } = require('util');

const { decode } = require('iconv-lite');
const { parseString } = require('xml2js');

const parseXML = promisify(parseString);

const getURL = (url) => {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      let body = '';
      res.on('data', data => body += decode(data, 'cp1251'));
      res.on('error', (e) => reject(e));
      res.on('end', () => resolve(body));
    });
  });
};

const main = async () => {
  const rssLink = 'http://metro.lviv.ua/news/rss.xml';
  const rawText = await getURL(rssLink);
  const parsed = await parseXML(rawText, { explicitArray: false });
  const news = parsed.rss.channel.item;

  news.forEach((newsItem) => {
    console.log(newsItem.title);
    console.log(`Date: ${newsItem.pubDate}, URL: ${newsItem.link}`);
    console.log('-');
  })
};

main();
