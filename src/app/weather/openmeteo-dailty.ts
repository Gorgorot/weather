import { VariablesWithTime } from '@openmeteo/sdk/variables-with-time';

export class OpenmeteoDaily {
  time: Date[] = [];
  temperature_2m_max: Float32Array | null = null;

  constructor(daily: VariablesWithTime, utcOffsetSeconds: number) {
    this.time = Array.from(
      { length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval() },
      (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
    );
    this.temperature_2m_max = daily.variables(0)!.valuesArray();
  }
}
