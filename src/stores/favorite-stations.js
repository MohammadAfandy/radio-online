import { writable } from 'svelte/store';
import FavoriteStationDB from '../services/db/favorite-station-db';

const createFavoriteStations = () => {
  const { subscribe, set, update } = writable([]);

  const getInitialData = async () => {
    const favorites = await FavoriteStationDB.getAll();
    set(favorites);
    return favorites;
  };

  return {
    subscribe,
    init: async () => {
      return getInitialData();
    },
    set: (stations) => {
      FavoriteStationDB.clear();
      for (const station of stations) {
        FavoriteStationDB.put(station);
      }
      return set(stations);
    },
    add: (station) => update((state) => {
      const isExist = state.some((st) => st.stationuuid === station.stationuuid);
      FavoriteStationDB.put(station);
      if (isExist) {
        return state;
      } else {
        return [
          ...state,
          station,
        ];
      }
    }),
    remove: (uuid) => update((state) => {
      FavoriteStationDB.delete(uuid);
      return state.filter((st) => st.stationuuid !== uuid);
    }),
    clear: () => {
      FavoriteStationDB.clear();
      return [];
    },
  };
};

export const favoriteStations = createFavoriteStations();
