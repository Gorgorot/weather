import { OpenMeteoDataTypes } from './weather-info';

export enum OpenmeteoHourlyParameters {
  temperature_2m = 'temperature_2m',
  relative_humidity_2m = 'relative_humidity_2m',
  dew_point_2m = 'dew_point_2m',
  apparent_temperature = 'apparent_temperature',
  precipitation_probability = 'precipitation_probability',
  rain = 'rain',
  showers = 'showers',
  snowfall = 'snowfall',
  visibility = 'visibility',
  wind_speed_10m = 'wind_speed_10m',
}

export const OpenmeteoHourlyParametersList = Object.keys(OpenmeteoHourlyParameters);


export enum OpenmeteoCurrentParameters {
  temperature_2m = 'temperature_2m',
  relative_humidity_2m = 'relative_humidity_2m',
  apparent_temperature = 'apparent_temperature',
  is_day = 'is_day',
  precipitation = 'precipitation',
  rain = 'rain',
  snowfall = 'snowfall',
  weather_code = 'weather_code',
  showers = 'showers',
  cloud_cover = 'cloud_cover',
  pressure_msl = 'pressure_msl',
  surface_pressure = 'surface_pressure',
  wind_gusts_10m = 'wind_gusts_10m',
  wind_direction_10m = 'wind_direction_10m',
  wind_speed_10m = 'wind_speed_10m',
}

export const OpenmeteoCurrentParametersList = Object.keys(OpenmeteoCurrentParameters);

export enum OpenmeteoDailyParameters {
  temperature_2m_max = 'temperature_2m_max',
  temperature_2m_min = 'temperature_2m_min',
  wind_speed_10m_max = 'wind_speed_10m_max',
}

export const OpenmeteoDailyParametersList = Object.keys(OpenmeteoDailyParameters);

export const OpenmeteoParametersIconsMap = <Record<OpenmeteoCurrentParameters | OpenmeteoHourlyParameters | string, string>>{
  [OpenmeteoCurrentParameters.temperature_2m]: 'ThermometerCelsiusFill',
  [OpenmeteoCurrentParameters.relative_humidity_2m]: 'HumidityFill',
  [OpenmeteoCurrentParameters.pressure_msl]: 'BarometerFill'
}

export const OpenmeteoDataTypeToQueryName = <Record<OpenMeteoDataTypes, string>>{
  [OpenMeteoDataTypes.HOURLY]: 'hourly',
  [OpenMeteoDataTypes.CURRENT]: 'current',
  [OpenMeteoDataTypes.DAILY]: 'daily',
};

export const OpenmeteoDataTypeToSet = <Record<OpenMeteoDataTypes, boolean>>{
  [OpenMeteoDataTypes.HOURLY]: true,
  [OpenMeteoDataTypes.CURRENT]: false,
  [OpenMeteoDataTypes.DAILY]: true,
};

export const OpenmeteoDataTypeToParametersList = <Record<OpenMeteoDataTypes, string[]>>{
  [OpenMeteoDataTypes.HOURLY]: OpenmeteoHourlyParametersList,
  [OpenMeteoDataTypes.CURRENT]: OpenmeteoCurrentParametersList,
  [OpenMeteoDataTypes.DAILY]: OpenmeteoDailyParametersList,
}

export const OPENMETEO_PARAMS_UNITS_MAP: Record<OpenmeteoHourlyParameters | OpenmeteoCurrentParameters | string, string> = {
  [OpenmeteoCurrentParameters.temperature_2m]: '°C',
  [OpenmeteoCurrentParameters.relative_humidity_2m]: '%',
  [OpenmeteoCurrentParameters.pressure_msl]: 'мм.рт.ст.',

  [OpenmeteoDailyParameters.temperature_2m_min]: '°C',
  [OpenmeteoDailyParameters.temperature_2m_max]: '°C',
  [OpenmeteoDailyParameters.wind_speed_10m_max]: 'м/с',
};
