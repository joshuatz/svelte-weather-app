import type {
	LocationKey,
	LocationSet,
	MultiDayForecastResponse,
} from '@types';
import { writable } from 'svelte/store';

export const DisplayMode = writable<'Standard' | 'Cards'>('Standard');

/**
 * Users set location
 */
export interface WeatherLocationStoredVal {
	key: LocationKey;
	LocalizedName: string;
	Country: LocationSet;
	AdministrativeArea: LocationSet;
}
export const WeatherLocation = writable<null | WeatherLocationStoredVal>(null);

/**
 * The last fetched forecast data
 */
export const ForecastData = writable<null | MultiDayForecastResponse>(null);

/**
 * If the app has encountered a network request indicating an authorization failure, likely caused by an invalid AccuWeather API key (set through Server env / config)
 */
export const AccuWeatherTokenFailed = writable(false);

/**
 * If the app has encountered some sort of response that would indicate exceeding the AccuWeather API limit
 */
export const AccuWeatherLimitExceeded = writable(false);

export const CsrfToken = writable<string | null>(null);

/**
 * If the app has encountered a network request indicating a "forbidden" response failure, likely caused by missing (or mismatched) CSRF token
 */
export const ForbiddenFailure = writable(false);
