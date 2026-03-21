import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {WeatherInfo} from '../../weather/weather-info';
import {ThemeDirective} from '../../directives/theme.directive';
import {MatButton} from '@angular/material/button';
import {DecimalPipe} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-weather-card',
  imports: [
    MatButton,
    DecimalPipe,
    MatTooltip,
  ],
  templateUrl: './weather-card.component.html',
  styleUrl: './weather-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    ThemeDirective,
  ],
})
export class WeatherCardComponent {
  weatherInfo = input.required<WeatherInfo>();
  additionalInfo = output<number>();
  delete = output<number>();
}
