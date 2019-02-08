const { promisify } = require('util');

const { parseString } = require('xml2js');

const { getURL } = require('./get-url');

const parseXML = promisify(parseString);

/**
 * Gets RSS-feed with given encoding
 * @param {string} rssURL
 * @param {string} encoding
 * @returns {Promise<*>}
 */
module.exports.parseRSS = async (rssURL, encoding = 'utf8') => {
  const rawText = await getURL(rssURL, encoding);

  return parseXML(rawText, { explicitArray: false });
};
