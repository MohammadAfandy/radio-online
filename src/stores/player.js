import { writable } from 'svelte/store';
import { radioBrowser } from '../services/api';
import LocalStorage from '../utils/local-storage';
import { showToast } from '../utils/toast';
import CONFIG from '../configs';

const { VOLUME_STEP } = CONFIG;

const createPlayer = () => {
  // create audio element object
  const audio = new Audio();
  audio.addEventListener('error', function(event) {
    console.error(event.currentTarget.error);
    update((state) => ({
      ...state,
      isPlaying: false,
    }));
    showToast('Sorry, failed to play station', 'danger');
  });

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
      const station = {
        ...state,
        stationuuid,
        name,
        favicon,
        url,
        url_resolved,
        song: initialData.song,
      };

      // set last played to local storage
      LocalStorage.set(CONFIG.LOCAL_STORAGE.LAST_STATION, JSON.stringify(station));

      return station;
    }),
    play: (url) => update((state) => {
      // send click event to radiobrowser
      radioBrowser.get(`url/${state.stationuuid}`);

      const mediaUrl = url || state.url_resolved || state.url;
      audio.src = mediaUrl;
      audio.play();

      return {
        ...state,
        isPlaying: true,
      };
    }),
    stop: () => update((state) => {
      audio.pause();
      return {
        ...state,
        isPlaying: false,
      };
    }),
    setVolume: (volume) => update((state) => {
      LocalStorage.set(CONFIG.LOCAL_STORAGE.VOLUME, volume);
      audio.volume = volume / VOLUME_STEP;
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
