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

export const AccuWeatherTokenFailed = writable(false);

export const CsrfToken = writable<string | null>(null);

export const ForbiddenFailure = writable(false);
