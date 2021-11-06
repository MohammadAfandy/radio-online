import { writable } from 'svelte/store';
import myAudio from '../services/audio';

const createPlayer = () => {
  const { subscribe, set, update } = writable({
    stationuuid: '',
    name: 'No station played',
    song: '...',
    favicon: '',
    url: '',
    url_resolved: '',
    volume: 20,
    isPlaying: false,
  });

  return {
    subscribe,
    set,
    update,
    setCurrentStation: ({
      stationuuid,
      name,
      favicon,
      url,
      url_resolved,
    }) => update((state) => {
      return {
        ...state,
        stationuuid,
        name,
        favicon,
        url,
        url_resolved,
      };
    }),
    play: (url) => update((state) => {
      url = url || state.url_resolved || state.url;
      myAudio.play(url);
      return {
        ...state,
        isPlaying: true,
      };
    }),
    stop: () => update((state) => {
      myAudio.stop();
      return {
        ...state,
        isPlaying: false,
      };
    }),
    setVolume: (volume) => update((state) => {
      myAudio.setVolume(volume / 20);
      return {
        ...state,
        volume,
      };
    }),
  };
};

export const player = createPlayer();
