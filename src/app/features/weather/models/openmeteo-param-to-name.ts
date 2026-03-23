import {
  OpenmeteoCurrentParameters,
  OpenmeteoDailyParameters,
  OpenmeteoHourlyParameters
} from './openmeteo-parameters';
import { OpenMeteoDataTypes } from './openmeteo-data-types';

export const OpenmeteoDateTypesNames = <Record<OpenMeteoDataTypes, string>>{
  [OpenMeteoDataTypes.DAILY]: 'По дням',
  [OpenMeteoDataTypes.HOURLY]: 'По часам',
  [OpenMeteoDataTypes.CURRENT]: 'Сейчас',
};

export const OpenmeteoParamToNameMap = <Record<OpenmeteoHourlyParameters | OpenmeteoCurrentParameters | OpenmeteoDailyParameters | string, string>>{
  [OpenmeteoHourlyParameters.apparent_temperature]: 'Ощущается как',
  [OpenmeteoHourlyParameters.relative_humidity_2m]: 'Относительная влажность (2м)',
  [OpenmeteoHourlyParameters.precipitation_probability]: 'Вероятность выпадения осадков',
  [OpenmeteoHourlyParameters.dew_point_2m]: 'Точка росы (2м)',
  [OpenmeteoHourlyParameters.visibility]: 'Видимость',
  [OpenmeteoHourlyParameters.wind_speed_10m]: 'Скорость ветра (10м)',
  [OpenmeteoHourlyParameters.temperature_2m]: 'Температура (2м)',

  [OpenmeteoCurrentParameters.pressure_msl]: 'Давление',
  [OpenmeteoCurrentParameters.wind_direction_10m]: 'Направление ветра (10м)',

  [OpenmeteoDailyParameters.temperature_2m_min]: 'Минимальная температура',
  [OpenmeteoDailyParameters.temperature_2m_max]: 'Максимальная температура',
  [OpenmeteoDailyParameters.wind_speed_10m_max]: 'Скорость ветра',
};
