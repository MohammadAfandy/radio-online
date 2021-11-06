import BaseDB from './base-db';

export default class FavoriteStation extends BaseDB {}

FavoriteStation.init({
  objectStoreName: 'favorite-station',
  keyPath: 'stationuuid',
});
