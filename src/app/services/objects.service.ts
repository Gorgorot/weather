import { inject, Injectable, signal } from '@angular/core';
import { IPolygon, PolygonsStoreService } from './polygons-store.service';
import { OpenMeteoDataTypes, WeatherInfo } from '../weather/weather-info';
import { WeatherApiService } from './weather-api.service';
import { catchError, filter, map, mergeMap, Observable, of, pairwise, startWith, tap, timeout, zip } from 'rxjs';
import { OpenmeteoDataTypeToQueryName } from '../weather/openmeteo-parameters';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

@UntilDestroy()
@Injectable()
export class ObjectsService {
  private readonly polygonsStoreService = inject(PolygonsStoreService);
  private readonly weatherApiService = inject(WeatherApiService);
  loading = signal(false);
  private readonly toastr = inject(ToastrService);

  weatherLoadFailed = signal(false);
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
        this.weatherLoadFailed.set(false);
      }),
      mergeMap(objects => {
        const queries = objects.map(item => {
          const req = item.requestedParameters!.reduce((acc, value) => {
            acc[OpenmeteoDataTypeToQueryName[value.type]] = value.selected.join(',');

            return acc;
          }, {} as Record<string, string>);

          return this.weatherApiService.fetch(item.center, req);
        });

        return zip(queries).pipe(
          timeout(5000),
          catchError(() => {
            this.toastr.error('Не удалось получить информацию о погоде');
            this.loading.set(false);
            this.weatherLoadFailed.set(true);

            return of(null);
          }),
          map(data => ({ weatherData: data, objects, })),
        )
      }),
      tap(() => this.loading.set(false)),
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
