import { Injectable } from '@angular/core';
import { fetchWeatherApi } from 'openmeteo';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Injectable({
  providedIn: 'root',
})
export class WeatherApiService {
  fetch() {
    const params = {
      latitude: 52.52,
      longitude: 13.41,
      hourly: "temperature_2m",
      current: ["temperature_2m", "relative_humidity_2m"],
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    return fromPromise(fetchWeatherApi(url, params));
  }
}
