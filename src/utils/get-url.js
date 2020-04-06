const axios = require('axios');
const { decodeStream } = require('iconv-lite');

const getDataFromStream = (dataStream, encoding) => {
  return new Promise((resolve, reject) => {
    dataStream.pipe(decodeStream(encoding)).collect((err, body) => {
      if (err) {
        return reject(err)
      }

      resolve(body)
    })
  })
};

/**
 * Get web-page content by HTTPS
 * @param {string} url
 * @param {string} encoding
 * @returns {Promise<any>}
 */
module.exports.getURL = (url, encoding) => {
  return axios({url, method: 'GET', responseType: 'stream'})
    .then(({data}) => getDataFromStream(data, encoding))
};
