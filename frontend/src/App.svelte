<script lang="ts">
	import type { MultiDayForecastResponse } from '@types';
	import { slide } from 'svelte/transition';
	import ForecastDisplayWrapper from './components/ForecastDisplayWrapper.svelte';
	import LocationPicker from './components/LocationPicker.svelte';
	import ModePicker from './components/ModePicker.svelte';
	import ObscureLoader from './components/UI/ObscureLoader.svelte';
	import {
		AccuWeatherTokenFailed,
		ForecastData,
		WeatherLocation,
	} from './store';
	import { fetchFromBackend, timeshiftDailyForecasts } from './utils';

	let isLoading = false;

	// If the user's desired location changes, we need to request a new forecast
	// data set for the new location, and push it to the store
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
		<div class="row">
			<div class="col-6" transition:slide>
				<ModePicker />
			</div>
			{#if $WeatherLocation}
				<div class="col-6 d-flex" transition:slide>
					<div
						class="card card-slim shadow-sm w-full d-flex flex-center-children"
					>
						<button
							on:click={() => {
								WeatherLocation.set(null);
							}}
							class="btn btn-secondary">Reset Location</button
						>
					</div>
				</div>
			{/if}
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

	{#if $AccuWeatherTokenFailed}
		<ObscureLoader
			loadingText="Authorization failed. Either over API limit or incorrect token."
		/>
	{/if}
</main>
