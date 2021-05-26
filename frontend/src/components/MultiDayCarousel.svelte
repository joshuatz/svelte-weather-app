<script lang="ts">
	import type { MultiDayForecastResponse } from '@types';
	import { getFormattedDate } from '../utils';
	import DayNightIconDisplay from './DayNightIconDisplay.svelte';
	import ValueSetRange from './ValueSetRange.svelte';

	export let forecast: MultiDayForecastResponse;

	$: days = forecast.DailyForecasts;
</script>

<div class="wrapper">
	<div class="row carousel">
		{#each days as dailyForecast, index (dailyForecast.EpochDate)}
			<div class="card">
				<div class="row justify-content-center">
					<h3 class="headline">
						{#if index === 0}
							Today
						{:else}
							{getFormattedDate(dailyForecast.Date).day}
						{/if}
					</h3>
				</div>
				<div class="placeholder-blur w-full">
					<!-- Highs and Lows -->
					<div class="row">
						<ValueSetRange range={dailyForecast.Temperature} />
					</div>
					<!-- Main Icon -->
					<DayNightIconDisplay data={dailyForecast} />
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.wrapper {
		overflow-x: auto;
	}
	.carousel {
		max-width: 100%;
		flex-wrap: nowrap;
		margin-right: 20px;
	}
	.carousel > .card {
		max-width: 360px;
		min-width: 275px;
		padding: 10px;
		margin: 10px;
	}
	/** Necessary, due to how flex handles overflow margins */
	.carousel:last-child::after {
		content: '';
		min-width: 10px;
	}
	.headline {
		font-size: 1.8rem;
	}
</style>
