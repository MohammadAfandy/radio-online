import { onDestroy } from 'svelte';

export const onInterval = (callback, milliseconds) => {
  const interval = setInterval(callback, milliseconds);

  onDestroy(() => {
    clearInterval(interval);
  });
};
