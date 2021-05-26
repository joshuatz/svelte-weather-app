<script lang="ts">
	import type { MultiDayForecastResponse } from '@types';
	import { slide } from 'svelte/transition';
	import ForecastDisplayWrapper from './components/ForecastDisplayWrapper.svelte';
	import LocationPicker from './components/LocationPicker.svelte';
	import ModePicker from './components/ModePicker.svelte';
	import { ForecastData, WeatherLocation } from './store';
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
	{#if isLoading}
		<div class="card" transition:slide>
			<div class="alert alert-primary filled" role="alert">
				<div>Loading...</div>
			</div>
		</div>
	{:else}
		<div transition:slide>
			<!-- Display mode picker -->
			<ModePicker />
		</div>
	{/if}

	{#if $WeatherLocation === null}
		<LocationPicker />
	{:else}
		<ForecastDisplayWrapper
			forecast={$ForecastData}
			location={$WeatherLocation.name}
		/>
	{/if}
</main>
