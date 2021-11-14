import { safeJSONParse } from './helpers';

class LocalStorage {
  static isStorageExist() {
    if (typeof Storage === 'undefined') {
      console.warn('Browser does not support local storage');
      return false;
    }
    return true;
  }

  static set(key, value) {
    if (!this.isStorageExist()) return;

    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }

    localStorage.setItem(key, value);
  }

  static get(key) {
    if (!this.isStorageExist()) return;

    const value = localStorage.getItem(key);
    const parsed = safeJSONParse(value);
    if (parsed === null) return value;
    return parsed;
  }

  static remove(key) {
    return this.isStorageExist() && localStorage.removeItem(key);
  }

  static clear() {
    return this.isStorageExist() && localStorage.clear();
  }
}

export default LocalStorage;
