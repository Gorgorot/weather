import { inject, Injectable, signal } from '@angular/core';
import { PolygonsStoreService } from './polygons-store.service';
import { OpenMeteoDataTypes, WeatherInfo } from '../weather/weather-info';
import { WeatherApiService } from './weather-api.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, mergeMap, of, tap, timeout, zip } from 'rxjs';
import { OpenmeteoDataTypeToQueryName } from '../weather/openmeteo-parameters';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToastrService } from 'ngx-toastr';

@UntilDestroy()
@Injectable()
export class ObjectsService {
  private readonly polygonsStoreService = inject(PolygonsStoreService);
  private readonly weatherApiService = inject(WeatherApiService);
  weatherLoadFailed = signal(false);

  objects = this.polygonsStoreService.allPolygons;
  loading = signal(true);
  private readonly toastr = inject(ToastrService);
  objectWeatherInfo = toSignal(
    toObservable(this.objects)
      .pipe(
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
        untilDestroyed(this),
      )
  );

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
