import { writable } from 'svelte/store';
import myAudio from '../services/audio';
import { radioBrowser } from '../services/api';
import CONFIG from '../configs';

const { VOLUME_STEP } = CONFIG;

const createPlayer = () => {
  const initialData = {
    stationuuid: '',
    name: 'No station played',
    song: '...',
    favicon: '',
    url: '',
    url_resolved: '',
    volume: 20,
    isPlaying: false,
  };
  const { subscribe, set, update } = writable(initialData);

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
        song: initialData.song,
      };
    }),
    play: (url) => update((state) => {
      url = url || state.url_resolved || state.url;
      myAudio.play(url);

      // send click count to radiobrowser server
      radioBrowser.get(`url/${state.stationuuid}`);

      // set last played to local storage
      localStorage.setItem(CONFIG.LOCAL_STORAGE.LAST_PLAYED, state.stationuuid);

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
      myAudio.setVolume(volume / VOLUME_STEP);
      return {
        ...state,
        volume,
      };
    }),
    updateSong: (song) => update((state) => {
      return {
        ...state,
        song: song || initialData.song,
      };
    }),
  };
};

export const player = createPlayer();
