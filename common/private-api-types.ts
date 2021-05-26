import type {
	AutocompleteSearchResponse,
	IpSearchResponse,
	MultiDayForecastResponse,
} from './AccuWeather-types';

export interface CommonResponse {
	errorMsg?: string;
}

export type PrivateApiResponse = CommonResponse &
	(
		| MultiDayForecastResponse
		| IpSearchResponse
		| AutocompleteSearchResponse
		| {}
	);

export type ApiService = 'ipLookup' | 'fiveDayForecast' | 'locationSearch';
