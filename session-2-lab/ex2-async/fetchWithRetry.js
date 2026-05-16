const { getData } = require("./apiClient");

async function fetchWithRetry(url, maxRetries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await getData(url);
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`);
}

module.exports = { fetchWithRetry };
