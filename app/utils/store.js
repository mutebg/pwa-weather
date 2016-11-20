class Store {

  constructor() {
    this.store = localStorage;
  }

  set(key, val) {
    this.store.setItem(key, JSON.stringify(val));
  }

  get(key) {
    return JSON.parse(this.store.getItem(key));
  }
}

export default new Store();
