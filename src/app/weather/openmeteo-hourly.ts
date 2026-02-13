import { VariablesWithTime } from '@openmeteo/sdk/variables-with-time';

export class OpenmeteoHourly {
  time: Date[] = [];
  temperature_2m: Float32Array | null = null;

  constructor(hourly: VariablesWithTime, utcOffsetSeconds: number) {
    this.time = Array.from(
      { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
      (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
    );
    this.temperature_2m = hourly.variables(0)!.valuesArray();
  }
}
