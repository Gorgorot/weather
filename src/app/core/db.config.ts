import { DBConfig } from 'ngx-indexed-db';

export const POLYGONS_STORE = 'polygons';

export const dbConfig: DBConfig = {
  name: 'MyDb',
  version: 1,
  objectStoresMeta: [{
    store: POLYGONS_STORE,
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'name', keypath: 'name', options: { unique: false } },
      { name: 'isCity', keypath: 'email', options: { unique: false } },
      { name: 'coordinates', keypath: 'coordinates', options: { unique: false } },
    ]
  }]
};
