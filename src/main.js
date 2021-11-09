import App from './App.svelte';
import { registerSW } from './utils/service-worker';

registerSW();

const app = new App({
  target: document.body,
  props: {},
});

export default app;
