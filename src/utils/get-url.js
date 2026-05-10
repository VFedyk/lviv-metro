/**
 * Get web-page content by HTTPS
 * @param {string} url
 * @param {string} encoding
 * @returns {Promise<string>}
 */
module.exports.getURL = async (url, encoding) => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return new TextDecoder(encoding).decode(buffer);
};
