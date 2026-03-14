import { VariablesWithTime } from '@openmeteo/sdk/variables-with-time';
import { BaseOpenmeteoAdapter } from './base-openmeteo-adapter';
import { OpenmeteoDateTypesNames } from './openmeteo-param-to-name';

export class OpenmeteoDaily extends BaseOpenmeteoAdapter {
  override title = OpenmeteoDateTypesNames.DAILY;
  time: Date[] = [];
  temperature_2m_max: Float32Array | null = null;

  constructor(daily: VariablesWithTime, utcOffsetSeconds: number, keys: string[]) {
    super();

    this.time = Array.from(
      { length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval() },
      (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
    );
    this.temperature_2m_max = daily.variables(0)!.valuesArray();
  }
}
