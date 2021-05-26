<script lang="ts">
	import type { DayForecast, MultiDayForecastResponse } from '@types';
	import { getFormattedDate, getIconPath } from '../utils';

	export let forecast: MultiDayForecastResponse;
	export let location: string;
	let today: DayForecast;
	let headline: MultiDayForecastResponse['Headline'];
	let nextThreeDays: DayForecast[];

	$: if (forecast) {
		const clonedForecasts = forecast.DailyForecasts.slice();
		today = clonedForecasts.shift();
		// We want next three days, not four, so remove last
		clonedForecasts.pop();
		nextThreeDays = clonedForecasts;
		headline = forecast.Headline;
	}
</script>

<div class="card multi-day-forecast shadow-lg">
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
				<!-- Main Icon -->
				<img
					class="col-10 col-sm-4"
					src={getIconPath(today.Day.Icon)}
					alt=""
					role="presentation"
				/>
			</div>
		</div>

		<div class="forecast row flex-center-children">
			<h3 class="headline">Next 3 Days:</h3>
			<div class="row">
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
</style>
