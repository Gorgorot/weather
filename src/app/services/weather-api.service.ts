import { Injectable } from '@angular/core';
import { fetchWeatherApi } from 'openmeteo';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { map, Observable } from 'rxjs';
import { WeatherApiResponse } from '@openmeteo/sdk/weather-api-response';

export interface IOpenMeteoRequestParams {
  latitude: number;
  longitude: number;
  hourly: 'temperature_2m';
  daily: 'temperature_2m_max';
  current: 'temperature_2m,relative_humidity_2m';
}

const URL = "https://api.open-meteo.com/v1/forecast"

@Injectable({
  providedIn: 'root',
})
export class WeatherApiService {
  fetch(params: IOpenMeteoRequestParams): Observable<WeatherApiResponse> {
    return fromPromise(fetchWeatherApi(URL, params)).pipe(
      map(result => result[0])
    )
  }
}
