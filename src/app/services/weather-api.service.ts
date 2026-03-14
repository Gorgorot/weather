import { Injectable } from '@angular/core';
import { fetchWeatherApi } from 'openmeteo';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { map, Observable } from 'rxjs';
import { WeatherApiResponse } from '@openmeteo/sdk/weather-api-response';
import { LngLat } from 'ymaps3';

type EnumKeyFields = { current?: string, daily?: string, hourly?: string };

const URL = "https://api.open-meteo.com/v1/forecast"

@Injectable({
  providedIn: 'root',
})
export class WeatherApiService {
  fetch(coordinates: LngLat, keys: EnumKeyFields): Observable<WeatherApiResponse> {
    const params = {
      longitude: coordinates[0],
      latitude: coordinates[1],
    };

    return fromPromise(fetchWeatherApi(URL, { ...params, ...keys })).pipe(
      map(result => result[0])
    )
  }
}
