import { writable } from 'svelte/store';
import myAudio from '../services/audio';
import { radioBrowser } from '../services/api';
import LocalStorage from '../utils/local-storage';
import { showToast } from '../utils/toast';
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
    play: async (url) => {
      update((state) => {
        return {
          ...state,
          isPlaying: true,
        };
      });
      try {
        await myAudio.play(url);
        return update((state) => {
          radioBrowser.get(`url/${state.stationuuid}`);
          return state;
        });
      } catch (error) {
        console.error(error);
        showToast('Sorry, failed to load station', 'danger');
        myAudio.stop();
        return update((state) => ({
          ...state,
          isPlaying: false,
        }));
      }
    },
    stop: () => update((state) => {
      myAudio.stop();
      return {
        ...state,
        isPlaying: false,
      };
    }),
    setVolume: (volume) => update((state) => {
      LocalStorage.set(CONFIG.LOCAL_STORAGE.VOLUME, volume);
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
