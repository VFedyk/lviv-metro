const { yellow, green } = require('chalk');
const { parseRSS } = require('../utils/parse-rss');

const printNewsItem = ({ title, pubDate, link }) => {
  process.stdout.write(`${yellow(title)}\n${link}\n${green(pubDate)}\n\n`, 'utf8');
};

const main = async () => {
  const parsedRSS = await parseRSS('http://metro.lviv.ua/news/rss.xml', 'cp1251');
  const news = parsedRSS.rss.channel.item;
  news.forEach(printNewsItem);
};

main();
