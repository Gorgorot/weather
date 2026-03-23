import { OpenmeteoDateTypesNames, OpenmeteoParamToNameMap } from '../../../../weather/models/openmeteo-param-to-name';
import { signal } from '@angular/core';
import { IPolygonParametersSetting } from '../../../../weather/services/polygons-store.service';
import {
  OpenmeteoDataTypeToParametersList,
  OpenmeteoDataTypeToQueryName,
  OpenmeteoDataTypeToSet,
} from '../../../../weather/models/openmeteo-parameters';
import { OpenMeteoDataTypes } from '../../../../weather/models/weather-info';

interface IPolygonSettingsRow<T = string> {
  title: string;
  key: T;
}

export class PolygonSettings<T = string> {
  type: OpenMeteoDataTypes;
  name: string = '';
  queryName: string = '';
  keys: T[] = [];
  rows: Array<IPolygonSettingsRow<T>> = [];
  list: Array<IPolygonSettingsRow & { selected: boolean }> = [];
  isSet = false;
  isOpened = signal(false);

  constructor(dataType: OpenMeteoDataTypes, keys: T[]) {
    this.type = dataType;
    this.name = OpenmeteoDateTypesNames[dataType];
    this.queryName = OpenmeteoDataTypeToQueryName[dataType];
    this.isSet = OpenmeteoDataTypeToSet[dataType];
    this.keys = keys;

    this.rows = this.keys.map(key => ({ title: OpenmeteoParamToNameMap[key as string], key: key }));
    this.list = OpenmeteoDataTypeToParametersList[dataType].map(key => ({
      title: OpenmeteoParamToNameMap[key],
      key: key,
      selected: this.keys.includes(key as T)
    }));
  }

  getQuery() {
    return `${this.name}=${this.keys.join(',')}`;
  }

  toggle() {
    this.isOpened.update(value => !value);
  }

  toPolygonSetting(): IPolygonParametersSetting {
    return {
      name: this.name,
      isSet: this.isSet,
      selected: this.list.filter(item => item.selected).map(item => item.key),
      queryName: this.queryName,
      type: this.type,
    }
  }
}
