export const DaysOfTheWeek = [
	'Sunday',
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday',
];

export const AccuWeatherApiBase =
	'http://dataservice.accuweather.com/locations/v1';

function getBackendBase(): string {
	const defaultBase = import.meta.env.DEV
		? 'http://localhost:3001'
		: document.location.origin;

	const envBase = import.meta.env.BACKEND_BASE;
	let backendBase: string | null =
		typeof envBase === 'string' && !!envBase ? envBase : null;

	// Special - codesandbox
	const HOSTNAME = import.meta.env.HOSTNAME;
	const ORIGIN = document.location.origin;
	// Host looks like fff-sandbox-abc123
	const sandboxPattHost = /^([^\r\n-]+)-sandbox-([^\r\n-]+)$/i;
	// Origin looks like https://abc123.fff.codesandbox.io
	const sandboxPattOrigin = /\/\/([^.]+)\.([^.]+)\.codesandbox\.io\/$/i;
	if (!backendBase && typeof HOSTNAME === 'string' && !!HOSTNAME) {
		if (sandboxPattHost.test(HOSTNAME)) {
			const matches = sandboxPattHost.exec(HOSTNAME);
			if (matches) {
				backendBase = `https://${matches[2]}-3001.${matches[1]}.codesandbox.io`;
			}
		}
	}
	if (!backendBase && sandboxPattOrigin.test(ORIGIN)) {
		const matches = sandboxPattOrigin.exec(ORIGIN);
		if (matches) {
			backendBase = `https://${matches[1]}-3001.${matches[2]}.codesandbox.io`;
		}
	}

	let finalBackendBase = backendBase || defaultBase;

	// Make sure it has trailing slash, necessary for fetch util
	if (!finalBackendBase.endsWith('/')) {
		finalBackendBase = `${finalBackendBase}/`;
	}
	console.log({ finalBackendBase });
	return finalBackendBase;
}

export const BackendBase = getBackendBase();
