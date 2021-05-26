import { Env } from './store';

export function delay(delayMs: number) {
	return new Promise((res) => setTimeout(res, delayMs));
}

/**
 * Get the public asset path to an AccuWeather icon, by ID
 * @param iconId The AccuWeather icon ID
 */
export function getIconPath(iconId: number) {
	let iconIdStr = iconId.toString();
	if (iconIdStr.length == 1) {
		iconIdStr = '0' + iconIdStr;
	}
	return `/assets/acc-icons/${iconIdStr}-s.png`;
}

/**
 * Wrapper around fetch() to backend
 * @param service The service / endpoint to query
 * @param params Extra parameters to pass
 */
export async function fetchFromBackend(
	service: 'ipLookup' | 'fiveDayForecast' | 'locationSearch',
	params?: Record<string, any>
) {
	const base = Env.backend_base;
	const endpoint = `${base}/?service=${service}`;

	// @TODO - remove - faking slow responses right now
	await delay(2000);

	const fetchRes = await fetch(endpoint);
	if (fetchRes.status !== 200) {
		throw new Error(`Bad Response from Backend - ${fetchRes.statusText}`);
	}

	return fetchRes.json();
}
