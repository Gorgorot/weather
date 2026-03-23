import { inject, Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { DrawingStyle, LngLat } from 'ymaps3';
import { POLYGONS_STORE } from '../../../core/db.config';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { map, pipe, switchMap, tap } from 'rxjs';
import { patchState, signalStore, type, withComputed, withMethods, withState } from '@ngrx/signals';
import {
  entityConfig,
  removeEntity,
  setAllEntities,
  updateEntity,
  upsertEntity,
  withEntities
} from '@ngrx/signals/entities';
import type { Geometry } from '@yandex/ymaps3-types/imperative/YMapFeature/types';
import { tapResponse } from '@ngrx/operators';
import { OpenmeteoDateTypesNames } from '../models/openmeteo-param-to-name';
import { OpenMeteoDataTypes } from '../models/weather-info';
import { OpenmeteoCurrentParameters, OpenmeteoHourlyParameters } from '../models/openmeteo-parameters';

export interface IPolygonParametersSetting<T = string> {
  isSet: boolean;
  name: string;
  selected: T[];
  queryName: string;
  type: OpenMeteoDataTypes;
}

export interface IPolygon {
  name: string;
  geometry: Geometry;
  style: DrawingStyle | undefined;
  center: LngLat;
  domCenter: LngLat;
  id: number;
  requestedParameters?: IPolygonParametersSetting[];
}

export const PolygonDefaultParameters = <Array<IPolygonParametersSetting<OpenmeteoHourlyParameters>>>[
  {
    selected: [
      OpenmeteoCurrentParameters.temperature_2m,
      OpenmeteoCurrentParameters.relative_humidity_2m,
    ],
    name: OpenmeteoDateTypesNames[OpenMeteoDataTypes.CURRENT],
    isSet: false,
    queryName: 'current',
    type: OpenMeteoDataTypes.CURRENT,
  },
  {
    selected: [],
    name: OpenmeteoDateTypesNames[OpenMeteoDataTypes.HOURLY],
    isSet: true,
    queryName: 'hourly',
    type: OpenMeteoDataTypes.HOURLY,
  },
  {
    selected: [],
    name: OpenmeteoDateTypesNames[OpenMeteoDataTypes.DAILY],
    isSet: true,
    queryName: 'daily',
    type: OpenMeteoDataTypes.DAILY,
  }
];

const polygonEntity = entityConfig({
  entity: type<IPolygon>(),
  collection: 'polygons',
  selectId: (entity) => entity.id,
});

interface IStoreState {
  selectedPolygonId: number | undefined;
}

const store = signalStore(
  { protectedState: false },
  withState(<IStoreState>{ selectedPolygonId: undefined }),
  withEntities(polygonEntity),
  withComputed((store) => ({
    selectedPolygon: () => {
      const selectedPolygonId = store.selectedPolygonId();
      const polygons = store.polygonsEntityMap();

      return selectedPolygonId ? polygons[selectedPolygonId] : undefined;
    },
    allPolygons: () => store.polygonsEntities(),
  })),
  withMethods((store) => ({
    setSelectedPolygonId: (id: number) => {
      patchState(store, { selectedPolygonId: id });
    },
    getObjectById: (id: number) => {
      const polygons = store.polygonsEntityMap();

      return polygons[id];
    }
  }))
)

@Injectable({
  providedIn: 'root',
})
export class PolygonsStoreService extends store {
  ngxIndexedDBService = inject(NgxIndexedDBService);
  remove = rxMethod<number>(
    pipe(
      switchMap((id) => {
        return this.ngxIndexedDBService.deleteByKey(
          POLYGONS_STORE,
          id,
        )
          .pipe(map(() => id));
      }),
      tap(id => patchState(this, removeEntity(id, polygonEntity))),
    )
  );
  removeAll = rxMethod<void>(
    pipe(
      switchMap(() => this.ngxIndexedDBService.clear(POLYGONS_STORE))
    )
  );
  private readonly loadData = rxMethod<void>(
    pipe(
      switchMap(() => this.getAll()),
      tapResponse({
        next: value => patchState(this, setAllEntities(value, polygonEntity)),
        error: (err) => console.error(err),
      })
    )
  );

  constructor() {
    super();

    this.loadData();
  }

  getAll() {
    return this.ngxIndexedDBService.getAll<IPolygon>(POLYGONS_STORE);
  }

  add(polygon: Omit<IPolygon, 'id'>) {
    return this.ngxIndexedDBService
      .add(
        POLYGONS_STORE,
        {
          ...polygon,
          requestedParameters: PolygonDefaultParameters,
        },
      )
      .pipe(
        tap(data => patchState(this, upsertEntity(data as unknown as IPolygon, polygonEntity))),
      )
  }

  update(polygon: IPolygon) {
    return this.ngxIndexedDBService
      .update(
        POLYGONS_STORE,
        polygon
      )
      .pipe(
        tap(data => patchState(this, updateEntity({ id: data.id, changes: data }, polygonEntity))),
      );
  }
}
