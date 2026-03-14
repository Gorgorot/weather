import { Component, input } from '@angular/core';
import { WeatherInfo } from '../../../../weather/weather-info';

@Component({
  selector: 'app-map-weather-card',
  templateUrl: './map-weather-card.component.html',
  styleUrl: './map-weather-card.component.scss',
  standalone: false,
})
export class MapWeatherCardComponent {
  weatherInfo = input.required<WeatherInfo>();
}
