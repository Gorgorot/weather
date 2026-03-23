import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import * as echarts from 'echarts/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { EChartsCoreOption } from 'echarts';
import { GridComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { BarChart, LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ObjectsService } from '@features/weather/services/objects.service';
import { ThemeDirective } from '@core/directives/theme.directive';
import { IOpenMeteoRowInfoParam, WeatherInfo } from '@features/weather/models/weather-info';
import { OpenmeteoHourly } from '@features/weather/models/openmeteo-hourly';
import { OpenMeteoDataTypes } from '@features/weather/models/openmeteo-data-types';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  BarChart,
  CanvasRenderer,
]);

interface HourlyChartSet {
  chartData: EChartsCoreOption;
  param: IOpenMeteoRowInfoParam;
}

@Component({
  selector: 'app-hourly-page',
  imports: [
    NgxEchartsDirective,
    MatIcon,
    MatProgressSpinner,
    RouterLink,
  ],
  templateUrl: './hourly-page.component.html',
  styleUrl: './hourly-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [ThemeDirective],
  providers: [
    provideEchartsCore({ echarts }),
    ObjectsService,
  ],
})
export class HourlyPageComponent {
  weatherInfo = computed<WeatherInfo | undefined>(() => {
    const id = this.objectId();
    const all = this.objectWeatherInfo();
    return all?.find(info => info.objectId === id);
  });
  chartSets = signal<HourlyChartSet[]>([]);
  private readonly objectsService = inject(ObjectsService);
  loading = this.objectsService.loading;
  objectWeatherInfo = this.objectsService.objectWeatherInfo;
  private readonly activatedRoute = inject(ActivatedRoute);
  objectId = toSignal(
    this.activatedRoute.queryParams.pipe(
      map(params => Number(params['id'])),
    ),
  );

  constructor() {
    effect(() => {
      const info = this.weatherInfo();
      if (!info) {
        this.chartSets.set([]);
        return;
      }
      this.chartSets.set(this.buildCharts(info));
    });
  }

  private buildCharts(info: WeatherInfo): HourlyChartSet[] {
    const hourlyRecord = [...info.records].find(r => r.type === OpenMeteoDataTypes.HOURLY);
    if (!hourlyRecord || !hourlyRecord.includedParams.length) return [];

    const adapter = hourlyRecord.data as OpenmeteoHourly;
    const monthNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    const timeLabels = adapter.time.map(d => {
      const h = d.getHours().toString().padStart(2, '0');
      return `${d.getDate()} ${monthNames[d.getMonth()]} ${h}:00`;
    });

    const chartColors: Record<string, { color: string; type: 'line' | 'bar' }> = {
      'temperature_2m': { color: '#ff8c3a', type: 'line' },
      'apparent_temperature': { color: '#ff6b6b', type: 'line' },
      'relative_humidity_2m': { color: '#4ac6ff', type: 'line' },
      'dew_point_2m': { color: '#a78bfa', type: 'line' },
      'precipitation_probability': { color: '#34d399', type: 'bar' },
      'visibility': { color: '#fbbf24', type: 'line' },
      'wind_speed_10m': { color: '#4a7cff', type: 'bar' },
    };

    return hourlyRecord.includedParams.map(param => {
      const rawValues: Float32Array | number[] = adapter[param.key];
      const values = Array.from(rawValues, v => Math.round(v * 100) / 100);
      const config = chartColors[param.key] ?? { color: '#ff8c3a', type: 'line' };

      const seriesItem: any = {
        data: values,
        type: config.type,
        color: config.color,
        name: param.title,
      };

      if (config.type === 'line') {
        seriesItem.smooth = true;
        seriesItem.symbol = 'none';
        seriesItem.lineStyle = { width: 2 };
        seriesItem.areaStyle = {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: config.color + '30' },
            { offset: 1, color: config.color + '05' },
          ]),
        };
      } else {
        seriesItem.barWidth = '60%';
        seriesItem.itemStyle = {
          borderRadius: [3, 3, 0, 0],
        };
      }

      const chartData: EChartsCoreOption = {
        title: {
          text: `${param.title}, ${param.unit}`,
          left: 16,
          top: 12,
          textStyle: {
            color: '#e0e0e0',
            fontSize: 14,
            fontWeight: 600,
          },
        },
        grid: {
          left: 50,
          right: 24,
          top: 50,
          bottom: 70,
        },
        xAxis: {
          type: 'category',
          data: timeLabels,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: {
            color: '#8a8a9a',
            fontSize: 11,
            rotate: 45,
            interval: Math.floor(timeLabels.length / 12),
          },
        },
        yAxis: {
          type: 'value',
          splitLine: { lineStyle: { color: '#2a2a3a' } },
          axisLabel: { color: '#8a8a9a', fontSize: 11 },
        },
        series: [seriesItem],
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#1e1e2e',
          borderColor: '#333',
          textStyle: { color: '#e0e0e0' },
          formatter: (params: any) => {
            const val = params[0].value;
            return `${params[0].name}<br/><b>${val} ${param.unit}</b>`;
          },
        },
      };

      return { chartData, param };
    });
  }
}
