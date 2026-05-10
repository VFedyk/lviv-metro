import chalk from 'chalk';
import { parseRSS } from '../utils/parse-rss.js';

const { yellow, green } = chalk;

const printNewsItem = ({ title, pubDate, link }) => {
  process.stdout.write(`${yellow(title)}\n${link}\n${green(pubDate)}\n\n`, 'utf8');
};

const main = async () => {
  try {
    const news = await parseRSS('https://metro.lviv.ua/news/rss.xml', 'cp1251');
    news.forEach(printNewsItem);
  } catch (e) {
    console.error(e.stack);
    process.exit(1);
  }
};

main();
