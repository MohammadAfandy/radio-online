import { Workbox } from 'workbox-window';

export const registerSW = () => {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');
    wb.register();
  } else {
    console.warn('Service worker not supported in browser');
  }
};
