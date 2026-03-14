import { OpenmeteoCurrentParameters, OpenmeteoHourlyParameters } from './openmeteo-parameters';
import { OpenMeteoDataTypes } from './weather-info';

export const OpenmeteoDateTypesNames = <Record<OpenMeteoDataTypes, string>>{
  [OpenMeteoDataTypes.DAILY]: 'По дням',
  [OpenMeteoDataTypes.HOURLY]: 'По часам',
  [OpenMeteoDataTypes.CURRENT]: 'Сейчас',
};

export const OpenmeteoParamToNameMap = <Record<OpenmeteoHourlyParameters | OpenmeteoCurrentParameters | string, string>>{
  [OpenmeteoHourlyParameters.rain]: 'Дождь',
  [OpenmeteoHourlyParameters.apparent_temperature]: 'Ощущается как',
  [OpenmeteoHourlyParameters.relative_humidity_2m]: 'Относительная влажность (2м)',
  [OpenmeteoHourlyParameters.precipitation_probability]: 'Вероятность выпадения осадков',
  [OpenmeteoHourlyParameters.showers]: 'Ливни',
  [OpenmeteoHourlyParameters.dew_point_2m]: 'Точка росы (2м)',
  [OpenmeteoHourlyParameters.visibility]: 'Видимость',
  [OpenmeteoHourlyParameters.wind_speed_10m]: 'Скорость ветра (10м)',
  [OpenmeteoHourlyParameters.snowfall]: 'Снегопад',
  [OpenmeteoHourlyParameters.temperature_2m]: 'Температура (2м)',

  [OpenmeteoCurrentParameters.precipitation]: 'Осадки',
  [OpenmeteoCurrentParameters.pressure_msl]: 'Давление',
  [OpenmeteoCurrentParameters.is_day]: 'День',
  [OpenmeteoCurrentParameters.wind_direction_10m]: 'Направление ветра (10м)'
};
