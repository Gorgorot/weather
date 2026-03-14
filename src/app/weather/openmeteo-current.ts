import { VariablesWithTime } from '@openmeteo/sdk/variables-with-time';
import { BaseOpenmeteoAdapter } from './base-openmeteo-adapter';

export class OpenMeteoCurrent extends BaseOpenmeteoAdapter {
  override title: string = 'Сейчас';
  override isSet = false;

  time: Date | null = null;

  constructor(current: VariablesWithTime, utcOffsetSeconds: number, keys: string[]) {
    super();

    this.time = new Date((Number(current.time()) + utcOffsetSeconds) * 1000);

    keys.forEach((key, index) => {
      this[key] = current.variables(index)!.value()
    });
  }
}
