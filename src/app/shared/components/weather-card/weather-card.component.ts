import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { WeatherInfo } from '@features/weather/models/weather-info';
import { ThemeDirective } from '@core/directives/theme.directive';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-weather-card',
  imports: [
    MatIconButton,
    MatIcon,
    DecimalPipe,
    MatTooltip,
    RouterLink,
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
  hideDetails = input(false);
  detailsDisabled = input(false);
  additionalInfo = output<number>();
  delete = output<number>();

  formattedArea = computed(() => {
    const areaM2 = this.weatherInfo().area;
    if (areaM2 === 0) return null;
    const ha = areaM2 / 10_000;
    if (ha < 100) return `${ha.toFixed(2)} га`;
    return `${(ha / 100).toFixed(2)} км²`;
  });

  formattedPerimeter = computed(() => {
    const meters = this.weatherInfo().perimeter;
    if (meters === 0) return null;
    if (meters < 1000) return `${meters.toFixed(0)} м`;
    return `${(meters / 1000).toFixed(2)} км`;
  });
}
