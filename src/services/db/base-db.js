import { openDB } from 'idb';
import CONFIG from '../../configs';
const { DATABASE } = CONFIG;

export default class BaseDB {
  static init({
    objectStoreName,
    ...options
  }) {
    this.objectStoreName = objectStoreName;
    this.dbPromise = openDB(DATABASE.NAME, DATABASE.VERSION, {
      upgrade(database) {
        database.createObjectStore(objectStoreName, options);
      },
    });
  }

  static async getAll() {
    return (await this.dbPromise).getAll(this.objectStoreName);
  }

  static async get(id) {
    if (!id) return null;
    return (await this.dbPromise).get(this.objectStoreName, id);
  }

  static async put(data) {
    return (await this.dbPromise).put(this.objectStoreName, data);
  }

  static async delete(id) {
    return (await this.dbPromise).delete(this.objectStoreName, id);
  }

  static async isExist(id) {
    return !!(await this.get(id));
  }
}
