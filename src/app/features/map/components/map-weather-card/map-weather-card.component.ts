import { Component, input } from '@angular/core';
import { WeatherInfo } from '@features/weather/models/weather-info';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-map-weather-card',
  templateUrl: './map-weather-card.component.html',
  styleUrl: './map-weather-card.component.scss',
  imports: [
    MatList,
    MatListItem,
    MatIcon,
    MatTooltip,
    RouterLink,
  ],
})
export class MapWeatherCardComponent {
  weatherInfo = input.required<WeatherInfo>();
}
