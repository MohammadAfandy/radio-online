import axios from 'axios';

let currentUrl = '';
let fallBackUrl = 'https://de1.api.radio-browser.info/json/';

const radioBrowser = axios.create({
  baseURL: currentUrl,
  headers: {
    // 'User-Agent': 'radio-sv/1.0',
    Accept: 'application/json',
  },
  params: {},
});

const getRandomServer = async () => {
  try {
    const response = await fetch(fallBackUrl + 'servers');
    const serverList = await response.json();
    const random = serverList[Math.floor(Math.random() * serverList.length)];
    return 'https://' + random.name + '/json/';
  } catch (error) {
    console.error('Cannot get server list');
    return fallBackUrl;
  }
};

radioBrowser.interceptors.request.use(
  async (config) => {
    // this is for the next request after we get the random server
    if (currentUrl) {
      config.baseURL = currentUrl;
      return config;
    }

    // on first request get random server
    const randomServer = await getRandomServer();
    config.baseURL = randomServer;
    currentUrl = config.baseURL;

    return config;
  },
  (error) => Promise.reject(error),
);

radioBrowser.interceptors.response.use(
  (response) => response,
  async (error) => {
    /**
     * on error server (500) we could try to get another server
     * and rerun the original request again (only on the first retry)
     */
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status >= 500 &&
      error.config &&
      !error.config.__isRetryRequest
    ) {
      originalRequest.__isRetryRequest = true;

      const randomServer = await getRandomServer();
      error.config.baseURL = randomServer;
      currentUrl = error.config.baseURL;

      return radioBrowser.request(error.config);
    }
    return Promise.reject(error);
  },
);

export { radioBrowser };
