import idb from 'idb-keyval';

class Store {

  constructor() {
    this.store = idb;
  }

  set(key, val) {
    this.store.set(key, JSON.stringify(val));
  }

  get(key) {
    return this.store.get(key).then((val) => {
      if (val) {
        return JSON.parse(val);
      }
      return null;
    });
  }

  delete(key) {
    this.store.delete(key);
  }
}

export default new Store();
