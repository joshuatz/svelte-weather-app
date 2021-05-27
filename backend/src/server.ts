import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { Config } from './constants';
import { fetchAndProxy, getAccuEndpoint, respond } from './utils';

const limiter = rateLimit({
	windowMs: 30 * 60 * 1000, // 30 minutes
	max: 100,
});
const app = express();
app.use(
	cors({
		origin: Config.corsAllowListCombined,
	}),
	// Limit requests per IP
	limiter
);
const port = Config.port;

app.get('/', (req, res) => {
	const qParams = req.query;
	res.set('Content-Type', 'application/json');

	if (typeof qParams.service === 'string') {
		if (
			qParams.service === 'fiveDayForecast' ||
			qParams.service === 'locationSearch'
		) {
			if (!qParams.q || typeof qParams.q !== 'string') {
				return respond(res, 400, {
					errorMsg: 'Missing q param',
				});
			}

			if (qParams.service === 'locationSearch') {
				const endpoint = getAccuEndpoint(
					`/locations/v1/cities/autocomplete`,
					{
						q: qParams.q,
					}
				);
				return fetchAndProxy(res, endpoint);
			}

			if (qParams.service === 'fiveDayForecast') {
				const endpoint = getAccuEndpoint(
					`/forecasts/v1/daily/5day/${qParams.q}`
				);
				return fetchAndProxy(res, endpoint);
			}
		}

		if (qParams.service === 'ipLookup') {
			const ip = req.header('x-forwarded-for') || req.ip;

			if (ip === '::1' || ip === '127.0.0.1') {
				return respond(res, 500, {
					errorMsg:
						'Express cannot properly determine the requesting IP address. Is likely either coming through local dev or proxy.',
				});
			}

			const endpoint = getAccuEndpoint('/locations/v1/cities/ipaddress', {
				q: req.ip,
			});
			return fetchAndProxy(res, endpoint);
		}

		return respond(res, 400, {
			errorMsg: `Could not understand service type of ${qParams.service}`,
		});
	}

	return respond(res, 400, {
		errorMsg: 'You are missing the service specifier',
	});
});

app.listen(port, () => {
	console.log(`Server is listening at localhost:${port}`);
});
