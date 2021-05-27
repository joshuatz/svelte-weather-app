<script lang="ts">
	import type { MultiDayForecastResponse } from '@types';
	export let headline: MultiDayForecastResponse['Headline'];
	export let location: string;
</script>

<div class="card shadow-lg">
	<!-- Location -->
	<div class="location row flex-center-children">
		<h2 class="title">{location}</h2>
	</div>

	<!-- Phrase / description -->
	<div class="headline-callout w-full">
		<div class="alert alert-primary filled" role="alert">
			<h3 class="title">How do things look?</h3>
			<div class="body placeholder-blur">{headline.Text}</div>
		</div>
	</div>
</div>

<style>
	.card {
		margin-top: 20px;
		margin-bottom: 10px;
		padding: 2px 14px 10px 14px;
	}
	.location .title {
		font-size: 2rem;
		margin: 4px auto 10px auto;
	}
	.headline-callout h3.title {
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
	@media (max-width: 500px) {
		.location .title {
			font-size: 1.5rem;
		}
		.headline-callout h3.title {
			font-size: 1.1rem;
		}
		.alert {
			padding: 8px;
		}
	}
</style>
