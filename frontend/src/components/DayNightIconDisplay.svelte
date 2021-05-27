<script lang="ts">
	import type { DayForecast } from '@types';
	import { getIconPath } from '../utils';

	export let data: Pick<Partial<DayForecast>, 'Day' | 'Night'>;
</script>

<div class="wrapper border-light row">
	<div class="day">
		<div class="row">
			<div class="row"><h3 class="title">Day</h3></div>
			<div class="body d-flex">
				<img
					src={getIconPath(data.Day.Icon)}
					alt=""
					role="presentation"
				/>
				<div class="phrase">{data.Day.IconPhrase}</div>
			</div>
		</div>
	</div>
	<div class="night">
		<div class="row">
			<div class="row"><h3 class="title">Night</h3></div>
			<div class="body d-flex">
				<img
					src={getIconPath(data.Night.Icon)}
					alt=""
					role="presentation"
				/>
				<div class="phrase">{data.Night.IconPhrase}</div>
			</div>
		</div>
	</div>
</div>

<style>
	.wrapper {
		position: relative;
		box-shadow: var(--lm-large-shadow);
	}
	.day,
	.night {
		width: auto;
		flex: 1;
	}
	.day {
		background-color: var(--secondary-color);
		color: var(--on-secondary-color);
		padding-bottom: 10px;
	}
	.day .body {
		margin-bottom: 10px;
	}
	.night {
		background-color: black;
		color: white;
	}
	.title {
		font-size: 1.3rem;
		margin: auto auto auto 10px;
		padding: 6px;
	}
	.phrase {
		font-size: 1.14rem;
		margin-left: 6px;
		padding-left: 6px;
	}
	img {
		width: 100px;
		height: auto;
		align-self: center;
	}
	@media (max-width: 600px) {
		.wrapper {
			border: none;
			box-shadow: none;
			min-height: 160px;
		}
		.day,
		.night {
			border-radius: 10px;
			box-shadow: var(--lm-large-shadow);
		}
		.day {
			position: absolute;
			top: 0px;
			left: 0px;
			width: calc(100% - 50px);
		}
		.night {
			position: absolute;
			top: 80px;
			left: 50px;
			width: calc(100% - 50px);
		}
		img {
			width: 60px;
		}
	}
	@media (max-width: 380px) {
		.day {
			width: calc(100% - 30px);
			padding-bottom: 20px;
		}
		.night {
			top: 120px;
			left: 30px;
			width: calc(100% - 30px);
		}
	}
</style>
