import { VariablesWithTime } from '@openmeteo/sdk/variables-with-time';
import { BaseOpenmeteoAdapter } from './base-openmeteo-adapter';
import { OpenmeteoDateTypesNames } from './openmeteo-param-to-name';

export class OpenmeteoHourly extends BaseOpenmeteoAdapter {
  override title = OpenmeteoDateTypesNames.HOURLY;
  time: Date[] = [];

  constructor(hourly: VariablesWithTime, utcOffsetSeconds: number, keys: string[]) {
    super();

    this.time = Array.from(
      { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
      (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
    );

    keys.forEach((key, index) => {
      this[key] = hourly.variables(index)!.valuesArray()
    });
  }
}
