import type {
	AutocompleteSearchResponse,
	IpSearchResponse,
	MultiDayForecastResponse,
} from './AccuWeather-types';

export interface CommonResponse {
	errorMsg?: string;
}

export interface CsrfTokenResponse {
	token: string;
}

export type PrivateApiResponse = CommonResponse &
	(
		| MultiDayForecastResponse
		| IpSearchResponse
		| AutocompleteSearchResponse
		| CsrfTokenResponse
		| {}
	);

export type ApiService =
	| 'ipLookup'
	| 'fiveDayForecast'
	| 'locationSearch'
	| 'getCsrfToken';
