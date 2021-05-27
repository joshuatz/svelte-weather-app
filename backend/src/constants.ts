export const AccuApiBase = 'http://dataservice.accuweather.com';
import type _IConfig from '../.env.example.json';

type IConfig = typeof _IConfig;

function getConfig(): IConfig {
	let config: Partial<IConfig> = {};
	try {
		// dist path of this file is at {ROOT}/backend/dist/backend/src/constants.js
		config = require('../../../.env.json');
	} catch (e) {
		console.warn(`Server is missing '.env.json' config file`);
	}

	return {
		accuWeatherKey: process.env.accuWeatherKey || config.accuWeatherKey!,
		port: !!process.env.port
			? parseInt(process.env.port, 10)
			: config.port || 3001,
	};
}

export const Config = getConfig();
