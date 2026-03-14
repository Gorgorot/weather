import { inject, Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { DrawingStyle, LngLat } from 'ymaps3';
import { POLYGONS_STORE } from '../db.config';
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
import { OpenmeteoDateTypesNames } from '../weather/openmeteo-param-to-name';
import { OpenMeteoDataTypes } from '../weather/weather-info';
import { OpenmeteoHourlyParameters } from '../weather/openmeteo-parameters';

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
  id: string;
  requestedParameters?: IPolygonParametersSetting[];
}

export const PolygonDefaultParameters = <Array<IPolygonParametersSetting<OpenmeteoHourlyParameters>>>[
  {
    selected: [],
    name: OpenmeteoDateTypesNames[OpenMeteoDataTypes.CURRENT],
    isSet: false,
    queryName: 'current',
    type: OpenMeteoDataTypes.CURRENT,
  },
  {
    selected: [
      OpenmeteoHourlyParameters.wind_speed_10m,
      OpenmeteoHourlyParameters.dew_point_2m,
      OpenmeteoHourlyParameters.temperature_2m,
    ],
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
  selectedPolygonId: string | undefined;
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
    setSelectedPolygonId: (id: string) => {
      patchState(store, { selectedPolygonId: id });
    },
  }))
)

@Injectable({
  providedIn: 'root',
})
export class PolygonsStoreService extends store {
  ngxIndexedDBService = inject(NgxIndexedDBService);
  remove = rxMethod<string>(
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
