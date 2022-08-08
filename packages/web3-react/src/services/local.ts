export class LocalStorage<T> {
  private reducerKey: string = "";

  constructor(reducerKey: string) {
    this.reducerKey = reducerKey;
  }

  get(defaultData: T) {
    const data = localStorage.getItem(this.reducerKey);
    if (data) {
      return JSON.parse(data) as T;
    }
    return defaultData;
  }

  set(data: T) {
    localStorage.setItem(this.reducerKey, JSON.stringify(data));
    return data;
  }
}
