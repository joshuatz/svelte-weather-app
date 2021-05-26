<script lang="ts">
	import type { ValueSet } from '@types';
	export let border = true;
	export let range: {
		Minimum: ValueSet;
		Maximum: ValueSet;
	};
	export let baseFontRem = 1.4;
	export let symbol: string | null = '°';
	export let showSep = true;
	$: low = range.Minimum;
	$: high = range.Maximum;
</script>

<div
	class="high-low row"
	data-border={border}
	style="--base-font-rem: {baseFontRem}rem;"
>
	<div class="kv{border ? ' border-light' : ''}">
		<div class="key row">Min</div>
		<div class="val row">
			{low.Value}
			{low.Unit}
			{#if symbol}
				<span class="symbol">{symbol}</span>
			{/if}
		</div>
	</div>
	{#if showSep}
		<div class="sep" />
	{/if}
	<div class="kv{border ? ' border-light' : ''}">
		<div class="key row">Max</div>
		<div class="val row">
			{high.Value}
			{high.Unit}
			{#if symbol}
				<span class="symbol">{symbol}</span>
			{/if}
		</div>
	</div>
</div>

<style>
	.high-low {
		align-items: center;
		justify-content: space-evenly;
		margin-bottom: 18px;
		width: 100%;
	}
	.high-low .kv {
		padding: 4px 12px;
	}
	.high-low .kv > * {
		text-align: center;
		justify-content: center;
	}
	.high-low .kv .symbol {
		margin-left: 4px;
		margin-top: -2px;
	}
	.high-low .key {
		font-size: var(--base-font-rem);
		font-style: italic;
	}
	.high-low .val {
		font-size: calc(var(--base-font-rem) + 0.4rem);
	}
	.high-low .sep {
		width: calc(var(--base-font-rem) * 2);
		height: calc(var(--base-font-rem) / 2);
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--accent-color);
	}
</style>
