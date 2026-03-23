import { inject, Injectable, signal } from '@angular/core';
import { IPolygon, PolygonsStoreService } from './polygons-store.service';
import { OpenMeteoDataTypes, WeatherInfo } from '../weather/weather-info';
import { WeatherApiService } from './weather-api.service';
import { LngLat } from 'ymaps3';
import {
  filter,
  map,
  merge,
  mergeMap,
  Observable,
  of,
  pairwise,
  share,
  startWith,
  takeUntil,
  tap,
  timer,
  zip
} from 'rxjs';
import { OpenmeteoDataTypeToQueryName } from '../weather/openmeteo-parameters';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { ToastrService } from 'ngx-toastr';

@UntilDestroy()
@Injectable()
export class ObjectsService {
  private readonly polygonsStoreService = inject(PolygonsStoreService);
  private readonly weatherApiService = inject(WeatherApiService);
  weatherPending = signal(false);

  loading = signal(false);
  private readonly toastrService = inject(ToastrService);
  objects = this.polygonsStoreService.allPolygons;
  private readonly _objectWeatherInfo = signal<WeatherInfo[] | undefined>(undefined);
  objectWeatherInfo = this._objectWeatherInfo.asReadonly();
  private readonly objectsWatcher = rxMethod((data: Observable<IPolygon[]>) => {
    return data.pipe(
      startWith([] as IPolygon[]),
      pairwise(),
      filter(([prev, curr]) => {
        if (curr.length < prev.length) {
          this.onObjectsRemoved(curr);
          return false;
        }
        return true;
      }),
      map(([, curr]) => curr),
      filter(objects => Boolean(objects.length)),
      tap(() => {
        this.loading.set(true);
        this.weatherPending.set(false);
      }),
      mergeMap(objects => {
        const queries = objects.map(item => {
          const req = item.requestedParameters!.reduce((acc, value) => {
            acc[OpenmeteoDataTypeToQueryName[value.type]] = value.selected.join(',');

            return acc;
          }, {} as Record<string, string>);

          return item.requestedParameters!.length ? this.weatherApiService.fetch(item.center, req) : of(null);
        });

        const request$ = zip(queries).pipe(share());

        const delayed$ = timer(5000).pipe(
          takeUntil(request$),
          map(() => ({ weatherData: null as null, objects, pending: true })),
        );

        const result$ = request$.pipe(
          map(data => ({ weatherData: data, objects, pending: false })),
        );

        return merge(delayed$, result$);
      }),
      tap(data => {
        this.loading.set(false);
        this.weatherPending.set(data.pending);

        if (data.pending) {
          this.toastrService.info('Запрашиваем погодные данные, подождите...', undefined, { positionClass: 'toast-bottom-right' });
        } else {
          this.toastrService.clear();
          this.toastrService.success('Погодные данные получены', undefined, { positionClass: 'toast-bottom-right' });
        }
      }),
      map(data => {
        return data.objects.map((object, index) => {
          const weatherData = data.weatherData ? data.weatherData[index] : null;

          return new WeatherInfo(
            object.name,
            object.style?.fill ?? '',
            object.id,
            object.center,
            weatherData,
            [
              {
                type: OpenMeteoDataTypes.CURRENT,
                keys: object.requestedParameters!.find(v => v.type === OpenMeteoDataTypes.CURRENT)!.selected,
              },
              {
                type: OpenMeteoDataTypes.DAILY,
                keys: object.requestedParameters!.find(v => v.type === OpenMeteoDataTypes.DAILY)!.selected,
              },
              {
                type: OpenMeteoDataTypes.HOURLY,
                keys: object.requestedParameters!.find(v => v.type === OpenMeteoDataTypes.HOURLY)!.selected,
              }
            ],
            object.geometry.coordinates[0] as LngLat[],
          );
        })
      }),
      tap(weatherInfo => this._objectWeatherInfo.set(weatherInfo)),
      untilDestroyed(this),
    )
  })(this.objects);

  private onObjectsRemoved(currentObjects: IPolygon[]): void {
    const currentIds = new Set(currentObjects.map(o => o.id));
    const current = this.objectWeatherInfo();

    if (current) {
      this._objectWeatherInfo.set(current.filter(info => currentIds.has(info.objectId)));
    }
  }

  getCurrentObjectWeatherInfo() {

  }

  objectWithIdHasInfoParams(id: number): boolean {
    const object = this.polygonsStoreService.getObjectById(id);

    if (!object) {
      throw new Error('No object with id');
    }

    return object.requestedParameters!.some((param) => param.selected.length > 0);
  }
}
