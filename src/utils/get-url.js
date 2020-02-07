const { readFileSync } = require('fs');
const { get, globalAgent } = require('https');
const { decode } = require('iconv-lite');

globalAgent.options.ca = readFileSync('node_modules/node_extra_ca_certs_mozilla_bundle/ca_bundle/ca_intermediate_root_bundle.pem');

/**
 * Get web-page content by HTTPS
 * @param {string} url
 * @param {string} encoding
 * @returns {Promise<any>}
 */
module.exports.getURL = (url, encoding = 'utf8') => {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      let body = '';
      res.on('data', data => body += decode(data, encoding));
      res.on('error', (e) => reject(e));
      res.on('end', () => resolve(body));
    });
  });
};
