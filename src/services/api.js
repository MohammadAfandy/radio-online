import axios from 'axios';

export const radioBrowser = axios.create({
  baseURL: 'https://de1.api.radio-browser.info/json/',
  headers: {
    // 'User-Agent': 'radio-sv/1.0',
    Accept: 'application/json',
  },
  params: {},
});

export const radioLise = axios.create({
  baseURL: 'https://service.radiolise.com/',
  headers: {
    // 'User-Agent': 'radio-sv/1.0',
    Accept: 'application/json',
  },
  params: {},
});
