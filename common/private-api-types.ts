import type {
	IpSearchResponse,
	MultiDayForecastResponse,
} from './AccuWeather-types';

export interface CommonResponse {
	errorMsg?: string;
}

export type Response = CommonResponse &
	(MultiDayForecastResponse | IpSearchResponse);
