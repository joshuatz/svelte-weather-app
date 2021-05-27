export const AccuApiBase = 'http://dataservice.accuweather.com';
import type _IConfig from '../.env.example.json';

type IConfig = typeof _IConfig;

function getConfig(): Omit<
	IConfig,
	'corsAllowList' | 'corsAllowListPatterns'
> & {
	corsAllowListCombined: Array<string | RegExp>;
	corsAllowListPatterns: RegExp[];
} {
	let config: Partial<IConfig> = {};
	try {
		try {
			// dist path of this file is at {ROOT}/backend/dist/backend/src/constants.js
			config = require('../../../.env.json');
		} catch (e) {
			config = require('../.env.json');
		}
	} catch (e) {
		console.warn(`Server is missing '.env.json' config file`);
	}

	const corsAllowListPlain = process.env.corsAllowList
		? [process.env.corsAllowList]
		: config.corsAllowList || [];
	const corsAllowListPatterns = (config.corsAllowListPatterns || []).map(
		(p) => new RegExp(p)
	);

	const corsAllowListCombined: Array<string | RegExp> = [
		...corsAllowListPlain,
		...corsAllowListPatterns,
	];

	return {
		accuWeatherKey: process.env.accuWeatherKey || config.accuWeatherKey!,
		port: !!process.env.port
			? parseInt(process.env.port, 10)
			: config.port || 3001,
		corsAllowListCombined,
		corsAllowListPatterns,
	};
}

export const Config = getConfig();
