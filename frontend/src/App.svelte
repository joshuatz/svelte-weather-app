<script lang="ts">
	import type { MultiDayForecastResponse } from '@types';
	import LocationPicker from './components/LocationPicker.svelte';
	import ModePicker from './components/ModePicker.svelte';
	import MultiDayCard from './components/MultiDayCard.svelte';
	import MultiDayCarousel from './components/MultiDayCarousel.svelte';
	import ObscureLoader from './components/UI/ObscureLoader.svelte';
	import { DisplayMode, ForecastData, WeatherLocation } from './store';
	import { fetchFromBackend, timeshiftDailyForecasts } from './utils';

	let isLoading = false;

	WeatherLocation.subscribe(async (updatedLocation) => {
		if (updatedLocation) {
			isLoading = true;
			try {
				const forecastResponse: MultiDayForecastResponse =
					await fetchFromBackend('fiveDayForecast', {
						q: updatedLocation.key,
					});
				timeshiftDailyForecasts(forecastResponse);
				ForecastData.set(forecastResponse);
			} catch (e) {
				ForecastData.set(null);
			}
			isLoading = false;
		} else {
			ForecastData.set(null);
		}
	});
</script>

<main>
	<!-- Display mode picker -->
	<ModePicker />
	{#if $WeatherLocation === null}
		<LocationPicker />
	{:else if isLoading || !$ForecastData}
		<ObscureLoader />
	{:else if $DisplayMode === 'Standard'}
		<MultiDayCard
			forecast={$ForecastData}
			location={$WeatherLocation.name}
		/>
	{:else}
		<MultiDayCarousel
			forecast={$ForecastData}
			location={$WeatherLocation.name}
		/>
	{/if}
</main>
