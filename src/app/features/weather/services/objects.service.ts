import { inject, Injectable, signal } from '@angular/core';
import { IPolygon, PolygonsStoreService } from './polygons-store.service';
import { WeatherInfo } from '../models/weather-info';
import { WeatherApiService } from './weather-api.service';
import { LngLat } from 'ymaps3';
import { forkJoin, map, of, switchMap, tap } from 'rxjs';
import { OpenmeteoDataTypeToQueryName } from '../models/openmeteo-parameters';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { WeatherApiResponse } from '@openmeteo/sdk/weather-api-response';

@Injectable()
export class ObjectsService {
  private readonly polygonsStoreService = inject(PolygonsStoreService);
  private readonly weatherApiService = inject(WeatherApiService);

  readonly objects = this.polygonsStoreService.allPolygons;
  readonly loading = signal(false);
  readonly weatherPending = signal(false);

  private readonly _objectWeatherInfo = signal<WeatherInfo[]>([]);
  readonly objectWeatherInfo = this._objectWeatherInfo.asReadonly();

  private readonly objectsWatcher = rxMethod<IPolygon[]>(
    (objects$) => objects$.pipe(
      switchMap(objects => {
        this.syncRemovedObjects(objects);

        if (!objects.length) {
          this.loading.set(false);
          return of(null);
        }

        this.loading.set(true);
        this.weatherPending.set(false);

        return this.fetchWeatherForObjects(objects).pipe(
          map(responses => this.mapToWeatherInfo(objects, responses)),
          tap(weatherInfo => {
            this._objectWeatherInfo.set(weatherInfo);
            this.loading.set(false);
            this.weatherPending.set(false);
          }),
        );
      }),
    ),
  )(this.objects);

  objectWithIdHasInfoParams(id: number): boolean {
    const object = this.polygonsStoreService.getObjectById(id);

    if (!object) {
      return false;
    }

    return object.requestedParameters?.some(param => param.selected.length > 0) ?? false;
  }

  private fetchWeatherForObjects(objects: IPolygon[]) {
    const queries = objects.map(object => {
      const params = this.buildQueryParams(object);
      const hasParams = object.requestedParameters?.length;

      return hasParams ? this.weatherApiService.fetch(object.center, params) : of(null);
    });

    return forkJoin(queries);
  }

  private buildQueryParams(object: IPolygon): Record<string, string> {
    return (object.requestedParameters ?? []).reduce((acc, param) => {
      if (param.selected.length) {
        acc[OpenmeteoDataTypeToQueryName[param.type]] = param.selected.join(',');
      }
      return acc;
    }, {} as Record<string, string>);
  }

  private mapToWeatherInfo(objects: IPolygon[], responses: (WeatherApiResponse | null)[]): WeatherInfo[] {
    return objects.map((object, index) => {
      const selectedData = (object.requestedParameters ?? []).map(param => ({
        type: param.type,
        keys: param.selected,
      }));

      return new WeatherInfo(
        object.name,
        object.style?.fill ?? '',
        object.id,
        object.center,
        responses[index],
        selectedData,
        object.geometry.coordinates[0] as LngLat[],
      );
    });
  }

  private syncRemovedObjects(currentObjects: IPolygon[]): void {
    const currentIds = new Set(currentObjects.map(o => o.id));
    const current = this._objectWeatherInfo();

    if (current.length) {
      const filtered = current.filter(info => currentIds.has(info.objectId));
      if (filtered.length !== current.length) {
        this._objectWeatherInfo.set(filtered);
      }
    }
  }
}
