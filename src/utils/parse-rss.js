const { getURL } = require('./get-url');

const extractTag = (xml, tag) => {
  const m = xml.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`));
  return m ? m[1].trim() : '';
};

/**
 * Gets RSS-feed with given encoding
 * @param {string} rssURL
 * @param {string} encoding
 * @returns {Promise<Array<{title: string, link: string, pubDate: string}>>}
 */
module.exports.parseRSS = async (rssURL, encoding = 'utf8') => {
  const xml = await getURL(rssURL, encoding);
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
