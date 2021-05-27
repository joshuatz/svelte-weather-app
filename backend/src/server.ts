import cookieParser from 'cookie-parser';
import cors from 'cors';
import csrf from 'csurf';
import express from 'express';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { Config } from './constants';
import { fetchAndProxy, getAccuEndpoint, respond } from './utils';

const limiter = rateLimit({
	windowMs: 30 * 60 * 1000, // 30 minutes
	max: 100,
});

const csrfProtection = csrf({
	cookie: true,
	ignoreMethods: ['HEAD', 'OPTIONS'],
});

const app = express();

// Static frontend hosting - double imports are due to TS vs transpiled dist
app.use(express.static(path.join(__dirname, '../../frontend/dist/')));
app.use(express.static(path.join(__dirname, '../../../../frontend/dist/')));

app.use(
	// Necessary for csrf / csurf
	cookieParser(),
	// Enable CORS, based on config values
	// Uses combined list of RegExp patterns and hardcoded origins
	cors({
		origin: Config.corsAllowListCombined,
		preflightContinue: true,
		credentials: true,
	}),
	// Limit requests per IP
	limiter
);

// CSRF protection, with excluded route that still captures token
app.use((req, res, next) => {
	csrfProtection(req, res, function (e: any) {
		if (req.path === '/csrf/') {
			next();
		} else {
			next(e);
		}
	});
});

const port = Config.port;

app.get('/csrf/', (req, res) => {
	res.status(200).send({ token: req.csrfToken() });
});

app.get('/api/', (req, res) => {
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
			const ip = req.headers['x-forwarded-for'] || req.ip;

			if (ip === '::1' || ip === '127.0.0.1') {
				return respond(res, 500, {
					errorMsg:
						'Express cannot properly determine the requesting IP address. Is likely either coming through local dev or proxy.',
				});
			}

			const endpoint = getAccuEndpoint('/locations/v1/cities/ipaddress', {
				q: ip,
			});
			console.log({ ip, xForwarded: req.headers['x-forwarded-for'] });
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
