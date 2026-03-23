import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { IOpenMeteoRowInfoParam, WeatherInfo } from '@features/weather/models/weather-info';
import * as echarts from 'echarts/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { EChartsCoreOption } from 'echarts';
import { GridComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { BarChart, GaugeChart, LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { QuickInfoService } from './quick-info.service';
import { IconAccentWrapper } from '@shared/components/icon-accent/icon-accent-wrapper.component';
import { WindRoseComponent } from '@shared/components/wind-rose/wind-rose.component';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  BarChart,
  GaugeChart,
  CanvasRenderer
]);

@Component({
  selector: 'app-quick-object-info',
  imports: [
    MatIconButton,
    MatIcon,
    NgxEchartsDirective,
    IconAccentWrapper,
    WindRoseComponent,
  ],
  templateUrl: './quick-object-info.component.html',
  styleUrl: './quick-object-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideEchartsCore({ echarts }),
    QuickInfoService,
  ]
})
export class QuickObjectInfoComponent {
  weatherInfo = input.required<WeatherInfo>();
  close = output<void>();
  currentParams = signal<IOpenMeteoRowInfoParam[]>([]);
  hourlySets = signal<Array<{ chartData: EChartsCoreOption, setData: IOpenMeteoRowInfoParam }>>([]);
  windDirection = signal<number | null>(null);
  private readonly quickInfoService = inject(QuickInfoService);

  constructor() {
    effect(() => {
      this.quickInfoService.attach(this.weatherInfo());
      this.currentParams.set(this.quickInfoService.getCurrentParams());
      this.hourlySets.set(this.quickInfoService.getHourlyInfoSets());
      this.windDirection.set(this.quickInfoService.getWindDirection());
    });
  }
}
