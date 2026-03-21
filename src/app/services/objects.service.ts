import {inject, Injectable, signal} from '@angular/core';
import {PolygonsStoreService} from './polygons-store.service';
import {OpenMeteoDataTypes, WeatherInfo} from '../weather/weather-info';
import {WeatherApiService} from './weather-api.service';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {map, mergeMap, tap, zip} from 'rxjs';
import {OpenmeteoDataTypeToQueryName} from '../weather/openmeteo-parameters';

@Injectable()
export class ObjectsService {
  private readonly polygonsStoreService = inject(PolygonsStoreService);
  private readonly weatherApiService = inject(WeatherApiService);

  objects = this.polygonsStoreService.allPolygons;
  loading = signal(true);
  objectWeatherInfo = toSignal(
    toObservable(this.objects)
      .pipe(
        tap(() => this.loading.set(true)),
        mergeMap(objects => {
          const queries = objects.map(item => {
            const req = item.requestedParameters!.reduce((acc, value) => {
              acc[OpenmeteoDataTypeToQueryName[value.type]] = value.selected.join(',');

              return acc;
            }, {} as Record<string, string>);

            return this.weatherApiService.fetch(item.center, req);
          });

          return zip(queries).pipe(map(data => ({ weatherData: data, objects, })))
        }),
        tap(() => this.loading.set(false)),
        map(data => {
          return data.weatherData.map((weather, index) => {
            const item = data.objects[index];

            return new WeatherInfo(
              item.name,
              item.style?.fill ?? '',
              item.id,
              item.center,
              weather,
              [
                {
                  type: OpenMeteoDataTypes.CURRENT,
                  keys: item.requestedParameters!.find(v => v.type === OpenMeteoDataTypes.CURRENT)!.selected,
                },
                {
                  type: OpenMeteoDataTypes.DAILY,
                  keys: item.requestedParameters!.find(v => v.type === OpenMeteoDataTypes.DAILY)!.selected,
                },
                {
                  type: OpenMeteoDataTypes.HOURLY,
                  keys: item.requestedParameters!.find(v => v.type === OpenMeteoDataTypes.HOURLY)!.selected,
                }
              ],
            );
          })
        }),
      )
  );

  getCurrentObjectWeatherInfo() {

  }

  objectWithIdHasInfoParams(id: number) {
    const object = this.polygonsStoreService.getObjectById(id);

    if (!object) {
      throw new Error('No object with id');
    }

    return object.requestedParameters!.some((param) => param.selected.length > 0);
  }
}
