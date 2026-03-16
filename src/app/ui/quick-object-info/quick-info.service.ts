import { Injectable, signal } from '@angular/core';
import { IOpenMeteoRowInfoParam, OpenMeteoDataTypes, WeatherInfo } from '../../weather/weather-info';
import { EChartsCoreOption } from 'echarts';
import { OpenmeteoDaily } from '../../weather/openmeteo-dailty';

@Injectable()
export class QuickInfoService {
  private weatherInfo = signal<WeatherInfo | null>(null);

  constructor() {
  }

  attach(weatherInfo: WeatherInfo) {
    this.weatherInfo.set(weatherInfo)
  }

  getHourlyInfoSets(): Array<{ chartData: EChartsCoreOption, setData: IOpenMeteoRowInfoParam }> {
    const weatherInfo = this.weatherInfo();

    if (!weatherInfo) {
      return [];
    }

    const hourlyInfo = [...weatherInfo.records].find(record => record.type === OpenMeteoDataTypes.DAILY);

    if (!hourlyInfo) {
      return [];
    }

    return hourlyInfo.includedParams.map(param => {
      const adapter = hourlyInfo.data as OpenmeteoDaily;
      const chartData: EChartsCoreOption = {
        title: {
          text: param.title,      // Основной текст
          left: 'center',              // Выравнивание (left, center, right)
          textStyle: {
            color: '#fff',             // Цвет текста
            fontSize: 16               // Размер шрифта
          }
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            // {MMM} — сокращенное название месяца (мар, апр)
            // {d} — число месяца
            formatter: '{d} {MMM}',

            // Чтобы подписи не накладывались друг на друга при сжатии
            hideOverlap: true,

            // Можно немного повернуть текст, если даты слишком плотно
            // rotate: 30
          }
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: adapter.time.map((date, index) => {
              return [
                date.toISOString().split('T')[0],
                Math.floor(adapter[param.key][index]),
              ]
            }),
            smooth: true,
            type: 'line',
            color: 'red'
          },
        ],
        tooltip: {
          trigger: 'axis',
          formatter: (params: any) => {
            const date = new Date(params[0].value[0]);
            return `${date.toLocaleDateString('ru-RU')} <br/> Значение: ${params[0].value[1]} ${param.unit} `;
          }
        },
      };

      return {
        chartData,
        setData: param,
      };
    });
  }
}
