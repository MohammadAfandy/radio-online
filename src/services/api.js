import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://de1.api.radio-browser.info/json/',
  headers: {
    // 'User-Agent': 'radio-app/1.0',
    Accept: 'application/json',
  },
  params: {},
});
