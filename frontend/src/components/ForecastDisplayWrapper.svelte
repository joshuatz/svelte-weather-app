<script lang="ts">
	import type { MultiDayForecastResponse } from '@types';
	import { DisplayMode } from '../store';
	import { getSampleForecast } from '../utils';
	import HeaderCard from './HeaderCard.svelte';
	import MultiDayCard from './MultiDayCard.svelte';
	import MultiDayCarousel from './MultiDayCarousel.svelte';

	let forecastInput: MultiDayForecastResponse | null = null;
	export { forecastInput as forecast };
	export let location: string;
	let forecast: MultiDayForecastResponse;
	let usePlaceholder = false;

	$: if (forecastInput) {
		const clonedForecasts = forecastInput.DailyForecasts.slice();
		// We want next three days, not four, so remove last
		clonedForecasts.pop();
		forecast = {
			...forecastInput,
			DailyForecasts: clonedForecasts,
		};
		usePlaceholder = false;
	} else {
		forecast = getSampleForecast();
		usePlaceholder = true;
	}

	$: headline = forecast.Headline;
</script>

<div data-placeholder={usePlaceholder}>
	<HeaderCard
		{headline}
		location={usePlaceholder ? 'Seattle, Washington' : location}
	/>

	{#if $DisplayMode === 'Standard'}
		<MultiDayCard {forecast} />
	{:else}
		<MultiDayCarousel {forecast} />
	{/if}
</div>
