import type { ApiService, MultiDayForecastResponse } from '@types';
import { get } from 'svelte/store';
import { BackendBase, DaysOfTheWeek } from './constants';
import {
	AccuWeatherLimitExceeded,
	AccuWeatherTokenFailed,
	CsrfToken,
	ForbiddenFailure,
} from './store';

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
	service: ApiService,
	params?: Record<string, any>
) {
	const csrfToken = get(CsrfToken);
	let base = BackendBase;
	if (service === 'getCsrfToken') {
		base = `${base}csrf/`;
	} else {
		base = `${base}api/`;
	}
	const finalParams = {
		...params,
		service,
	};
	const urlInstance = new URL(`${base}`);
	urlInstance.search = new URLSearchParams(finalParams).toString();
	const endpoint = urlInstance.toString();

	const headers = new Headers();
	if (!!csrfToken) {
		headers.append('CSRF-Token', csrfToken);
	}

	const fetchRes = await fetch(endpoint, {
		headers,
		credentials: 'include',
	});

	if (fetchRes.status !== 200) {
		if (fetchRes.status === 401) {
			AccuWeatherTokenFailed.set(true);
		}
		if (fetchRes.status === 403) {
			ForbiddenFailure.set(true);
		}
		if (fetchRes.status === 503 || fetchRes.status === 504) {
			AccuWeatherLimitExceeded.set(true);
		}
		throw new Error(`Bad Response from Backend - ${fetchRes.statusText}`);
	}

	return fetchRes.json();
}

export function getFormattedDate(dateStrOrMs: string | number) {
	const date = new Date(dateStrOrMs);
	return {
		obj: date,
		day: DaysOfTheWeek[date.getDay()],
	};
}

/**
 * Returns a date object that is offset from the passed in one by x days
 * - Does not mutate the input date object
 * @param date Date to offset
 * @param numToAdd Number of days to offset into the future
 */
export function addDays(date: Date, numToAdd = 1): Date {
	const dateCopy = new Date(date.getTime());
	dateCopy.setDate(dateCopy.getDate() + numToAdd);
	return dateCopy;
}

/**
 * Makes sure that all the individual forecast days have time boundaries that align with localized time
 * - Since AccuWeather does not provide a mechanism to request data segmented by *local* time, the forecasted date stamps might not actually align with the days they go with (e.g. first element in array should always be today, but the stamp might be right on the border and actually be yesterday in local time)
 * - This is not ideal, but I don't see any API option to request localized slots
 * - **Warning**: This mutates the original object passed in
 * @param response The original forecast response to timeshift
 */
export function timeshiftDailyForecasts(response: MultiDayForecastResponse) {
	let now = new Date();
	for (let x = 0; x < response.DailyForecasts.length; x++) {
		const forecastDay = response.DailyForecasts[x];
		if (
			getFormattedDate(forecastDay.EpochDate * 1000).obj.getDate() !==
			now.getDate()
		) {
			// Override
			forecastDay.Date = now.toISOString();
			forecastDay.EpochDate = now.getTime() / 1000;
		}
		now = addDays(now, 1);
	}
}

/**
 * Generate some sample data for placeholder elements while loading
 */
export function getSampleForecast(): MultiDayForecastResponse {
	const now = new Date();
	const nextThreeDays = [addDays(now, 1), addDays(now, 2), addDays(now, 3)];
	const tomorrow = nextThreeDays[0];
	const today = {
		Date: now.toString(),
		EpochDate: now.getTime() / 1000,
		Temperature: {
			Minimum: {
				Value: 43.0,
				Unit: 'F',
				UnitType: 18,
			},
			Maximum: {
				Value: 55.0,
				Unit: 'F',
				UnitType: 18,
			},
		},
		Day: {
			Icon: 14,
			IconPhrase: 'Partly sunny w/ showers',
			HasPrecipitation: true,
		},
		Night: {
			Icon: 38,
			IconPhrase: 'Mostly cloudy',
			HasPrecipitation: false,
		},
		Sources: [],
		MobileLink: '',
		Link: '',
	};
	const headline = {
		EffectiveDate: now.toString(),
		EffectiveEpochDate: now.getTime(),
		Severity: 3,
		Text: 'Expect showery weather Wednesday morning through Wednesday evening',
		Category: 'rain',
		EndDate: tomorrow.toString(),
		EndEpochDate: tomorrow.getTime(),
		MobileLink: '',
		Link: '',
	};
	return {
		Headline: headline,
		DailyForecasts: [
			today,
			{
				...today,
				Date: nextThreeDays[0].toString(),
				EpochDate: nextThreeDays[0].getTime(),
			},
			{
				...today,
				Date: nextThreeDays[1].toString(),
				EpochDate: nextThreeDays[1].getTime(),
			},
			{
				...today,
				Date: nextThreeDays[2].toString(),
				EpochDate: nextThreeDays[2].getTime(),
			},
		],
	};
}
