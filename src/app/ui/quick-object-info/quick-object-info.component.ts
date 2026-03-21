import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { IOpenMeteoRowInfoParam, WeatherInfo } from '../../weather/weather-info';
import * as echarts from 'echarts/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { EChartsCoreOption } from 'echarts';
import { GridComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { BarChart, LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { QuickInfoService } from './quick-info.service';
import { IconAccentWrapper } from '../icon-accent/icon-accent-wrapper.component';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  BarChart,
  CanvasRenderer
]);

@Component({
  selector: 'app-quick-object-info',
  imports: [
    MatIconButton,
    MatIcon,
    NgxEchartsDirective,
    IconAccentWrapper
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
  private readonly quickInfoService = inject(QuickInfoService);

  constructor() {
    effect(() => {
      this.quickInfoService.attach(this.weatherInfo());
      this.currentParams.set(this.quickInfoService.getCurrentParams());
      this.hourlySets.set(this.quickInfoService.getHourlyInfoSets());
    });
  }
}
