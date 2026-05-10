import { getURL } from './get-url.js';

const extractTag = (xml, tag) => {
  const m = xml.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`));
  return m ? m[1].trim() : '';
};

export const parseItems = (xml) => {
  const items = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    items.push({
      title:   extractTag(m[1], 'title'),
      link:    extractTag(m[1], 'link'),
      pubDate: extractTag(m[1], 'pubDate'),
    });
  }
  return items;
};

/**
 * Gets RSS-feed with given encoding
 * @param {string} rssURL
 * @param {string} encoding
 * @returns {Promise<Array<{title: string, link: string, pubDate: string}>>}
 */
export const parseRSS = async (rssURL, encoding = 'utf8') =>
  parseItems(await getURL(rssURL, encoding));
