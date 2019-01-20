const { get } = require('http');
const { decode } = require('iconv-lite');

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
