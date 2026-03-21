import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import * as echarts from 'echarts/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { EChartsCoreOption } from 'echarts';
import { GaugeChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([GaugeChart, CanvasRenderer]);

@Component({
  selector: 'app-wind-rose',
  imports: [NgxEchartsDirective],
  templateUrl: './wind-rose.component.html',
  styleUrl: './wind-rose.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideEchartsCore({ echarts })],
})
export class WindRoseComponent {
  direction = input.required<number>();

  chartOptions = computed<EChartsCoreOption>(() => {
    const dir = this.direction();

    return {
      series: [
        {
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          min: 0,
          max: 360,
          splitNumber: 8,
          center: ['50%', '50%'],
          radius: '90%',
          axisLine: {
            lineStyle: {
              width: 2,
              color: [[1, '#3a3a4a']],
            },
          },
          splitLine: {
            length: 8,
            distance: -8,
            lineStyle: {
              color: '#5a5a6a',
              width: 2,
            },
          },
          axisTick: {
            length: 4,
            distance: -4,
            splitNumber: 5,
            lineStyle: {
              color: '#5a5a6a',
              width: 1,
            },
          },
          axisLabel: {
            distance: 12,
            color: '#8a8a9a',
            fontSize: 11,
            fontWeight: 600,
            formatter: (value: number) => {
              const labels: Record<number, string> = {
                0: 'С', 45: 'СВ', 90: 'В', 135: 'ЮВ',
                180: 'Ю', 225: 'ЮЗ', 270: 'З', 315: 'СЗ',
              };
              return labels[value] ?? '';
            },
          },
          pointer: {
            length: '60%',
            width: 5,
            itemStyle: {
              color: '#ff4a4a',
            },
          },
          anchor: {
            show: true,
            size: 8,
            itemStyle: {
              color: '#e0e0e0',
              borderWidth: 0,
            },
          },
          data: [{ value: dir }],
          animation: true,
          animationDuration: 600,
        },
      ],
    };
  });
}
