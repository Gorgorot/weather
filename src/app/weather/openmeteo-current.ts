import { VariablesWithTime } from '@openmeteo/sdk/variables-with-time';

export class OpenMeteoCurrent {
  time: Date | null = null;
  temperature_2m = 0;
  relative_humidity_2m = 0;

  constructor(current: VariablesWithTime, utcOffsetSeconds: number) {
    this.time = new Date((Number(current.time()) + utcOffsetSeconds) * 1000);
    this.temperature_2m = current.variables(0)!.value();
    this.relative_humidity_2m = current.variables(1)!.value();
  }
}
