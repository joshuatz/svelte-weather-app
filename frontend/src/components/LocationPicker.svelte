<script lang="ts">
	import type { AutocompleteSearchResponse, IpSearchResponse } from '@types';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { WeatherLocation } from '../store';
	import { fetchFromBackend } from '../utils';
	import ObscureLoader from './UI/ObscureLoader.svelte';

	let isLoading = true;
	let autoLocationFailed = false;
	let searchInput = '';
	let lastSearched = '';
	let autoLocationResult: IpSearchResponse;
	let searchResults: AutocompleteSearchResponse;

	async function runAutocomplete(evt?: Event) {
		if (evt) {
			evt.preventDefault();
		}

		// Reset
		searchResults = null;
		lastSearched = searchInput;
		isLoading = true;

		try {
			searchResults = await fetchFromBackend('locationSearch', {
				q: searchInput,
			});
		} catch (e) {
			console.error(e);
			searchResults = [];
		}

		isLoading = false;
	}

	/**
	 * Try to guess user location without any necessary input
	 */
	async function tryAutoLocation() {
		isLoading = true;

		try {
			// AccuWeather IP lookup will try automatic resolution of IP address
			const ipInfo: IpSearchResponse = await fetchFromBackend('ipLookup');
			if (!!ipInfo.Key && !!ipInfo.LocalizedName) {
				autoLocationResult = ipInfo;
			} else {
				autoLocationFailed = true;
			}
		} catch (e) {
			console.error(e);
			autoLocationFailed = true;
		}

		isLoading = false;
	}

	function handleAutoLocationChoice(choice: 'reject' | 'confirm') {
		if (choice === 'confirm') {
			WeatherLocation.set({
				key: autoLocationResult.Key,
				name: autoLocationResult.LocalizedName,
			});
		} else {
			// This will trigger the manual search & pick flow
			autoLocationFailed = true;
		}
	}

	onMount(() => {
		tryAutoLocation();
	});
</script>

<div class="location-picker card card-slim">
	{#if autoLocationResult && !autoLocationFailed}
		<div class="card">
			<div class="alert filled">
				<div class="alert-heading">Suggested Location</div>
				Based on your IP address, it looks like you might be located near
				{autoLocationResult.LocalizedName} in Postal Code {autoLocationResult.PrimaryPostalCode}.
				Is this correct?
			</div>
			<div class="row confirm-buttons">
				<button
					class="btn btn-success"
					on:click={() => handleAutoLocationChoice('confirm')}
					>Yes!</button
				>
				<button
					class="btn btn-danger"
					on:click={() => handleAutoLocationChoice('reject')}
					>No (or, I want a different location)</button
				>
			</div>
		</div>
	{/if}
	<form on:submit={runAutocomplete}>
		<div class="row align-items-center justify-evenly">
			<div class="form-group">
				<label for="location-search-input">Location search:</label>
				<input
					disabled={autoLocationFailed === false}
					id="location-search-input"
					class="form-control form-control-lg"
					type="text"
					bind:value={searchInput}
				/>
			</div>
			<button class="search-button btn btn-success">Search</button>
		</div>
	</form>
	{#if searchResults}
		<div class="search-results" transition:slide>
			{#if searchResults.length}
				<!-- User will be able to select from list -->
				<div class="pick-list">
					{#each searchResults as location (location.Key)}
						<div
							class="option border-light row flex-center-children"
						>
							<div class="location-name">
								{location.LocalizedName}, {location
									.AdministrativeArea.LocalizedName} - {location
									.Country.LocalizedName}
							</div>
							<div>
								<button
									class="btn btn-success"
									on:click={() => {
										WeatherLocation.set({
											key: location.Key,
											name: location.LocalizedName,
										});
									}}>Select</button
								>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="alert filled alert-secondary">
					<div class="alert-heading">No results!</div>
					Sorry, but we could not find any results for "{lastSearched}".
					Perhaps try a larger city, or check for typos?
				</div>
			{/if}
		</div>
	{/if}
	{#if isLoading}
		<ObscureLoader />
	{/if}
</div>

<style>
	.form-group,
	form {
		margin-bottom: 10px;
	}
	.location-picker {
		position: relative;
	}
	.confirm-buttons > button {
		margin: 8px auto;
	}
	.pick-list .option {
		margin-bottom: 8px;
		padding: 5px;
	}
	.pick-list .option .location-name {
		display: flex;
		align-items: center;
		flex: 1;
	}
	.pick-list .option button {
		margin-right: 8px;
	}
</style>
