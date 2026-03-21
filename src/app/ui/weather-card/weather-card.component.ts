import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { OpenMeteoDataTypes, WeatherInfo } from '../../weather/weather-info';
import { ThemeDirective } from '../../directives/theme.directive';
import { MatButton } from '@angular/material/button';
import { OpenmeteoCurrentParameters } from '../../weather/openmeteo-parameters';
import { MatIcon } from '@angular/material/icon';
import { IconAccentWrapper } from '../icon-accent/icon-accent-wrapper.component';
import { WindRoseComponent } from '../wind-rose/wind-rose.component';

@Component({
  selector: 'app-weather-card',
  imports: [
    MatButton,
    MatIcon,
    IconAccentWrapper,
    WindRoseComponent
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

  currentTemperature = computed(() => {
    const info = this.weatherInfo();

    return info.get(OpenMeteoDataTypes.CURRENT, OpenmeteoCurrentParameters.temperature_2m);
  });

  windDirection = computed(() => {
    try {
      const info = this.weatherInfo();
      const param = info.get(OpenMeteoDataTypes.CURRENT, OpenmeteoCurrentParameters.wind_direction_10m);
      return param ? parseFloat(param.value) : null;
    } catch {
      return null;
    }
  });
}
