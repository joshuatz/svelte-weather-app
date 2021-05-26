<script lang="ts">
	import type { DayForecast, MultiDayForecastResponse } from '@types';
	import { getFormattedDate, getIconPath, getSampleForecast } from '../utils';
	import DayNightIconDisplay from './DayNightIconDisplay.svelte';
	import ValueSetRange from './ValueSetRange.svelte';

	export let forecast: MultiDayForecastResponse | null = null;
	export let location: string;
	let today: DayForecast;
	let headline: MultiDayForecastResponse['Headline'];
	let usePlaceholder = false;
	let nextThreeDays: DayForecast[];
	$: if (forecast) {
		const clonedForecasts = forecast.DailyForecasts.slice();
		today = clonedForecasts.shift();
		// We want next three days, not four, so remove last
		clonedForecasts.pop();
		nextThreeDays = clonedForecasts;
		headline = forecast.Headline;
		usePlaceholder = false;
	} else {
		const sample = getSampleForecast();
		today = sample.DailyForecasts.shift();
		nextThreeDays = sample.DailyForecasts;
		headline = sample.Headline;
		usePlaceholder = true;
	}
</script>

<div
	class="card multi-day-forecast shadow-lg"
	data-placeholder={usePlaceholder}
>
	<div class="row">
		<div class="location row flex-center-children">
			<h2 class="headline">{location}</h2>
		</div>
		<!-- Headline Callout -->
		<div class="headline-callout w-full">
			<div class="alert alert-primary filled" role="alert">
				<h3>How do things look?</h3>
				<div class="body placeholder-blur">{headline.Text}</div>
			</div>
			<p />
		</div>
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
				{#each nextThreeDays as dailyForecast (dailyForecast.EpochDate)}
					<div class="forecastDay border-light">
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
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.location .headline {
		font-size: 2rem;
	}
	.headline-callout h3 {
		font-size: 1.3rem;
		line-height: 1rem;
		width: 100%;
		margin: auto auto 1.5rem auto;
	}
	.headline-callout .body {
		font-size: 1rem;
		width: 95%;
		margin-left: 5%;
		font-style: italic;
	}

	.today .headline {
		font-size: 1.2rem;
	}
	.forecast .headline {
		font-size: 1.2rem;
	}
	.forecastDay {
		width: 30%;
		margin-left: auto;
		margin-right: auto;
	}
	.forecastDay img {
		align-self: center;
		min-width: 80px;
		height: auto;
	}
	.forecastDay .phrase {
		font-style: italic;
		text-align: center;
	}
	[data-placeholder='true'] .placeholder-blur {
		filter: blur(0.2rem);
	}
	[data-placeholder='true'] img {
		background-color: var(--secondary-color);
		margin-top: 6px;
		width: 90px;
		height: auto;
	}
</style>
