import { WeatherApiResponse } from '@openmeteo/sdk/weather-api-response';
import { OpenMeteoCurrent } from './openmeteo-current';
import { OpenmeteoDaily } from './openmeteo-dailty';
import { OpenmeteoHourly } from './openmeteo-hourly';
import { LngLat } from 'ymaps3';
import { MathHelper } from '@shared/utils/math-helper';
import { OpenMeteoDataTypes } from './openmeteo-data-types';

export interface IOpenMeteoRowInfoParam {
  key: string;
  value: string;
  title: string;
  icon: string;
  unit: string;
}

export interface IOpenMeteoRowInfo<T = string> {
  type: OpenMeteoDataTypes;
  data: OpenMeteoCurrent | OpenmeteoDaily | OpenmeteoHourly;
  includedParams: IOpenMeteoRowInfoParam[];
}

export interface IOpenMeteoSelectedData {
  type: OpenMeteoDataTypes;
  keys: string[];
}

export class WeatherInfo {
  records = new Set<IOpenMeteoRowInfo>();
  title: string = '';
  color: string = '';
  objectId: number = 0;
  center: LngLat = [0, 0];
  area: number = 0;
  perimeter: number = 0;
  vertexCount: number = 0;

  constructor(title: string, color: string, objectId: number, center: LngLat, openmeteoData: WeatherApiResponse | null, allowedTypes: IOpenMeteoSelectedData[], polygonCoordinates?: LngLat[]) {
    this.title = title;
    this.color = color;
    this.objectId = objectId;
    this.center = center;

    if (polygonCoordinates && polygonCoordinates.length >= 3) {
      this.area = MathHelper.getPolygonArea(polygonCoordinates);
      this.perimeter = MathHelper.getPolygonPerimeter(polygonCoordinates);
      this.vertexCount = polygonCoordinates.length;
    }

    if (openmeteoData) {
      this.init(openmeteoData, allowedTypes);
    }
  }

  private init(openmeteoData: WeatherApiResponse, allowedTypes: IOpenMeteoSelectedData[]): void {
    allowedTypes.forEach((value) => {
      if (!value.keys.length) {
        return;
      }

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
            unit: adapter.getUnit(key),
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

  get(recordType: OpenMeteoDataTypes, key: string) {
    for (const record of this.records) {
      if (record.type === recordType) {
        return record.includedParams.find(param => param.key === key);
      }
    }

    throw new Error(`${key} not found`);
  }
}
