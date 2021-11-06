import BaseDB from './base-db';

export default class FavoriteStationDB extends BaseDB {}

FavoriteStationDB.init({
  objectStoreName: 'favorite-station',
  keyPath: 'stationuuid',
});
