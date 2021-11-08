import axios from 'axios';

export const radioLise = axios.create({
  baseURL: 'https://service.radiolise.com/',
  headers: {
    // 'User-Agent': 'radio-sv/1.0',
    Accept: 'application/json',
  },
  params: {},
});
