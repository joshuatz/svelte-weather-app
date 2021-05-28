<script lang="ts">
	import type { CsrfTokenResponse, MultiDayForecastResponse } from '@types';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import ForecastDisplayWrapper from './components/ForecastDisplayWrapper.svelte';
	import LocationPicker from './components/LocationPicker.svelte';
	import ModePicker from './components/ModePicker.svelte';
	import PoweredBy from './components/PoweredBy.svelte';
	import ObscureLoader from './components/UI/ObscureLoader.svelte';
	import {
		AccuWeatherLimitExceeded,
		AccuWeatherTokenFailed,
		CsrfToken,
		ForbiddenFailure,
		ForecastData,
		WeatherLocation,
	} from './store';
	import { fetchFromBackend, timeshiftDailyForecasts } from './utils';

	let isLoading = false;
	let locationString = '';

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
			locationString = `${updatedLocation.LocalizedName}, ${updatedLocation.AdministrativeArea.LocalizedName}`;
			isLoading = false;
		} else {
			ForecastData.set(null);
			locationString = '';
		}
	});

	// On mount, check for CSRF token and get a new one if not present
	onMount(async () => {
		if (!$CsrfToken) {
			isLoading = true;
			const tokenResponse: CsrfTokenResponse = await fetchFromBackend(
				'getCsrfToken'
			);
			CsrfToken.set(tokenResponse.token);
			isLoading = false;
		}
	});
</script>

<main>
	<!-- Top Menu Bar -->
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
		{#if $CsrfToken}
			<LocationPicker />
		{/if}
	{:else}
		<ForecastDisplayWrapper
			forecastData={$ForecastData}
			location={locationString}
		/>
	{/if}

	{#if $AccuWeatherTokenFailed}
		<ObscureLoader
			loadingText="Authorization failed. Likely incorrect API Key"
		/>
	{/if}

	{#if $AccuWeatherLimitExceeded}
		<ObscureLoader
			loadingText="Request failed - AccuWeather API quota exceeded. Please try back later."
		/>
	{/if}

	{#if $ForbiddenFailure}
		<ObscureLoader
			loadingText="Authorization failed, please try reloading the page for a fresh token"
		/>
	{/if}
</main>
<div class="powered-by-wrapper">
	<PoweredBy />
</div>

<style>
	main {
		/** Help push "powered-by" label lower, if app has minimal content */
		min-height: 400px;
	}
	.powered-by-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20px;
		width: 100%;
	}
</style>
