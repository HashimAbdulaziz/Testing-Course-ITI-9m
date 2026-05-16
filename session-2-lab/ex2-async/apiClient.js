const axios = require("axios");

async function getData(url) {
  const { data } = await axios.get(url);
  return data;
}

module.exports = { getData };
