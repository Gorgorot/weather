import { OpenmeteoParamToNameMap } from './openmeteo-param-to-name';
import { OPENMETEO_PARAMS_UNITS_MAP, OpenmeteoParametersIconsMap } from './openmeteo-parameters';

export class BaseOpenmeteoAdapter {
  title: string = '';
  isSet: boolean = true;

  [key: string]: any;

  getValue(key: string): any {
    return Number(this[key].toString()).toFixed(2);
  }

  getName(key: string) {
    return OpenmeteoParamToNameMap[key];
  }

  getUnit(key: string) {
    return OPENMETEO_PARAMS_UNITS_MAP[key] ?? '';
  }

  getIcon(key: string) {
    return OpenmeteoParametersIconsMap[key] ?? '';
  }
}
