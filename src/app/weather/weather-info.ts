import {WeatherApiResponse} from '@openmeteo/sdk/weather-api-response';
import {OpenMeteoCurrent} from './openmeteo-current';
import {OpenmeteoDaily} from './openmeteo-dailty';
import {OpenmeteoHourly} from './openmeteo-hourly';

export enum OpenMeteoDataTypes {
  CURRENT = 'CURRENT',
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
};

export interface IOpenMeteoRowInfo<T = string> {
  type: OpenMeteoDataTypes;
  data: OpenMeteoCurrent | OpenmeteoDaily | OpenmeteoHourly;
  includedParams: Array<{ key: string, value: string, title: string, icon: string }>;
}

export interface IOpenMeteoSelectedData {
  type: OpenMeteoDataTypes;
  keys: string[];
}

export class WeatherInfo {
  records = new Set<IOpenMeteoRowInfo>();
  title: string = '';
  color: string = '';
  objectId: string = '';

  constructor(title: string, color: string, objectId: string, openmeteoData: WeatherApiResponse, allowedTypes: IOpenMeteoSelectedData[]) {
    this.title = title;
    this.color = color;
    this.objectId = objectId;

    this.init(openmeteoData, allowedTypes);
  }

  private init(openmeteoData: WeatherApiResponse, allowedTypes: IOpenMeteoSelectedData[]): void {
    allowedTypes.forEach((value) => {
      const adapterFactory = this.getDataByType(openmeteoData, value.type);
      const adapter = adapterFactory(value.keys);

      this.records.add({
        type: value.type,
        data: adapter,
        includedParams: value.keys.map(key => {
          return {
            key,
            value: `${adapter.getValue(key)} ${adapter.getUnit(key)}`,
            title: adapter.getName(key),
            icon: adapter.getIcon(key),
          }
        }),
      });
    });
  }

  private getDataByType(openmeteoData: WeatherApiResponse, type: OpenMeteoDataTypes) {
    switch (type) {
      case OpenMeteoDataTypes.CURRENT:
        return (keys: string[]) => new OpenMeteoCurrent(openmeteoData.current()!, openmeteoData.utcOffsetSeconds(), keys);
      case OpenMeteoDataTypes.DAILY:
        return (keys: string[]) => new OpenmeteoDaily(openmeteoData.daily()!, openmeteoData.utcOffsetSeconds(), keys);
      case OpenMeteoDataTypes.HOURLY:
        return (keys: string[]) => new OpenmeteoHourly(openmeteoData.hourly()!, openmeteoData.utcOffsetSeconds(), keys);
    }
  }
}
