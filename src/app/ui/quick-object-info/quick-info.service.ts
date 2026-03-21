import {Injectable, signal} from '@angular/core';
import {IOpenMeteoRowInfoParam, OpenMeteoDataTypes, WeatherInfo} from '../../weather/weather-info';
import {OpenmeteoCurrentParameters} from '../../weather/openmeteo-parameters';
import {EChartsCoreOption} from 'echarts';
import {OpenmeteoDaily} from '../../weather/openmeteo-dailty';
import * as echarts from 'echarts/core';

interface ChartSet {
  chartData: EChartsCoreOption;
  setData: IOpenMeteoRowInfoParam;
}

@Injectable()
export class QuickInfoService {
  private weatherInfo = signal<WeatherInfo | null>(null);

  attach(weatherInfo: WeatherInfo) {
    this.weatherInfo.set(weatherInfo);
  }

  getWindDirection(): number | null {
    const weatherInfo = this.weatherInfo();
    if (!weatherInfo) return null;

    try {
      const param = weatherInfo.get(OpenMeteoDataTypes.CURRENT, OpenmeteoCurrentParameters.wind_direction_10m);
      return param ? parseFloat(param.value) : null;
    } catch {
      return null;
    }
  }

  getCurrentParams(): IOpenMeteoRowInfoParam[] {
    const weatherInfo = this.weatherInfo();
    if (!weatherInfo) return [];

    for (const record of weatherInfo.records) {
      if (record.type === OpenMeteoDataTypes.CURRENT) {
        return record.includedParams;
      }
    }
    return [];
  }

  getHourlyInfoSets(): ChartSet[] {
    const weatherInfo = this.weatherInfo();
    if (!weatherInfo) return [];

    const dailyInfo = [...weatherInfo.records].find(record => record.type === OpenMeteoDataTypes.DAILY);
    if (!dailyInfo) return [];

    const chartColors: Record<string, { color: string; type: 'line' | 'bar' }> = {
      'temperature_2m_max': { color: '#ff8c3a', type: 'line' },
      'temperature_2m_min': { color: '#4ac6ff', type: 'line' },
      'wind_speed_10m_max': { color: '#4a7cff', type: 'bar' },
    };

    return dailyInfo.includedParams.map(param => {
      const adapter = dailyInfo.data as OpenmeteoDaily;
      const config = chartColors[param.key] ?? { color: '#ff8c3a', type: 'line' };

      const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
      const labels = adapter.time.map(d => dayNames[d.getDay()]);
      const values = adapter.time.map((_: Date, i: number) => Math.round(adapter[param.key][i]));

      const seriesItem: any = {
        data: values,
        type: config.type,
        color: config.color,
        name: param.title,
      };

      if (config.type === 'line') {
        seriesItem.smooth = true;
        seriesItem.symbol = 'circle';
        seriesItem.symbolSize = 6;
        seriesItem.lineStyle = { width: 2 };
        seriesItem.areaStyle = {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: config.color + '40' },
            { offset: 1, color: config.color + '05' },
          ]),
        };
      } else {
        seriesItem.barWidth = '40%';
        seriesItem.itemStyle = {
          borderRadius: [3, 3, 0, 0],
        };
      }

      const chartData: EChartsCoreOption = {
        title: {
          text: param.title,
          left: 10,
          top: 8,
          textStyle: {
            color: '#e0e0e0',
            fontSize: 14,
            fontWeight: 600,
          },
          subtextStyle: {
            color: config.color,
            fontSize: 12,
            fontWeight: 600,
          },
        },
        grid: {
          left: 40,
          right: 20,
          top: 50,
          bottom: 30,
        },
        xAxis: {
          type: 'category',
          data: labels,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#8a8a9a', fontSize: 11 },
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
            return `${params[0].name}: <b>${val} ${param.unit}</b>`;
          },
        },
      };

      return { chartData, setData: param };
    });
  }
}
