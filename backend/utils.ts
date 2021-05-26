import { PrivateApiResponse } from '@types';
import type { Response } from 'express';
import fetch from 'node-fetch';
import { URL, URLSearchParams } from 'url';
import { AccuApiBase, Config } from './constants';

export function getAccuEndpoint(apiPath: string, params?: Record<string, any>) {
	const urlInstance = new URL(`${AccuApiBase}${apiPath}`);
	const queryParams = {
		...params,
		apikey: Config.accuWeatherKey,
	};
	urlInstance.search = new URLSearchParams(queryParams).toString();
	return urlInstance.toString();
}

export async function fetchAndProxy(res: Response, endpoint: string) {
	const accuRes = await fetch(endpoint);
	let payload;
	try {
		payload = await accuRes.json();
	} catch (e) {
		payload = {
			errorMsg: 'Could not parse JSON body',
		};
	}
	return res.status(accuRes.status).send(payload);
}

export function respond<T extends PrivateApiResponse>(
	res: Response,
	statusCode: number,
	payload: T
) {
	return res.status(statusCode).send(payload);
}
