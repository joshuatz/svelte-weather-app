import type { LocationKey, MultiDayForecastResponse } from '@types';
import { writable } from 'svelte/store';
export { default as Env } from '../.env.json';

export const DisplayMode = writable<'Standard' | 'Cards'>('Standard');

/**
 * Users set location
 */
export const WeatherLocation =
	writable<null | {
		key: LocationKey;
		name: string;
	}>(null);

/**
 * The last fetched forecast data
 */
export const ForecastData = writable<null | MultiDayForecastResponse>(null);
