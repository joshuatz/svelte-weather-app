<script lang="ts">
	import type { MultiDayForecastResponse } from '@types';
	import { getFormattedDate, getIconPath } from '../utils';
	import DayNightIconDisplay from './DayNightIconDisplay.svelte';
	import ValueSetRange from './ValueSetRange.svelte';

	export let forecast: MultiDayForecastResponse;
	$: today = forecast.DailyForecasts[0];
	$: days = forecast.DailyForecasts;
</script>

<div class="card multi-day-forecast shadow-lg">
	<div class="row">
		<div class="today row flex-center-children">
			<h3 class="headline">Today's Weather:</h3>
			<div class="placeholder-blur w-full">
				<!-- Highs and Lows -->
				<div class="row">
					<ValueSetRange range={today.Temperature} />
				</div>
				<!-- Main Icon -->
				<DayNightIconDisplay data={today} />
			</div>
		</div>

		<div class="forecast row flex-center-children">
			<h3 class="headline">Next 3 Days:</h3>
			<div class="placeholder-blur row">
				{#each days as dailyForecast, index (dailyForecast.EpochDate)}
					<!-- Skip first entry - today -->
					{#if index > 0}
						<div class="forecastDay shadow-lg border-light">
							<div class="row justify-content-center">
								<div class="title">
									{getFormattedDate(dailyForecast.Date).day}
								</div>
							</div>
							<div class="row justify-content-center">
								<img
									class="col-10 col-sm-4"
									src={getIconPath(dailyForecast.Day.Icon)}
									alt=""
									role="presentation"
								/>
								<div class="col-8">
									<ValueSetRange
										range={dailyForecast.Temperature}
										border={false}
										baseFontRem={1}
										showSep={false}
									/>
								</div>
								<div class="col-12 phrase">
									{dailyForecast.Day.IconPhrase}
								</div>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.multi-day-forecast {
		margin-top: 20px;
	}
	.today .headline {
		font-size: 1.2rem;
	}
	.forecast .headline {
		font-size: 1.2rem;
	}
	.forecastDay {
		width: 30%;
		min-width: 120px;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 4px;
		background: linear-gradient(
			282deg,
			var(--primary-color-lighter),
			var(--primary-color-darker)
		);
		color: white;
	}
	.forecastDay img {
		align-self: center;
		min-width: 80px;
		max-width: 120px;
		height: auto;
	}
	.forecastDay .phrase {
		font-style: italic;
		text-align: center;
		padding: 0px 4px;
	}
	:global([data-placeholder='true'] img) {
		background-color: var(--secondary-color);
		margin-top: 6px;
		width: 90px;
		height: auto;
	}

	@media (max-width: 440px) {
		.forecastDay {
			width: 90%;
		}
		.forecastDay img {
			flex: 0;
		}
	}
</style>
