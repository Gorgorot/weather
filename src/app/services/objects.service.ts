import { inject, Injectable } from '@angular/core';
import { PolygonsStoreService } from './polygons-store.service';
import { OpenMeteoDataTypes, WeatherInfo } from '../weather/weather-info';
import { WeatherApiService } from './weather-api.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, mergeMap, zip } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ObjectsService {
  private readonly polygonsStoreService = inject(PolygonsStoreService);
  private readonly weatherApiService = inject(WeatherApiService);

  objects = this.polygonsStoreService.allPolygons;
  objectWeatherInfo = toSignal(
    toObservable(this.objects)
      .pipe(
        mergeMap(objects => {
          const queries = objects.map(item => {
            const req = {
              current: [
                'temperature_2m',
                'relative_humidity_2m',
              ].join(','),
            };

            return this.weatherApiService.fetch(item.center, req);
          })

          return zip(queries).pipe(map(data => ({ weatherData: data, objects, })))
        }),
        map(data => {
          return data.weatherData.map((weather, index) => {
            const item = data.objects[index];

            return new WeatherInfo(
              item.name,
              item.style?.fill ?? '',
              item.id,
              weather,
              [
                {
                  type: OpenMeteoDataTypes.CURRENT,
                  keys: [
                    'temperature_2m',
                    'relative_humidity_2m',
                  ],
                }
              ],
            );
          })
        }),
      )
  )
}
