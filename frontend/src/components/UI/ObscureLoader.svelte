<script lang="ts">
	export let loadingText = 'Loading...';
</script>

<div class="obscure w-full h-full">
	<div class="d-flex w-full h-full justify-content-center align-items-center">
		<div class="loading-text">{loadingText}</div>
	</div>
</div>

<style>
	.obscure {
		width: 100%;
		height: 100%;
		top: 0px;
		left: 0px;
		position: absolute;
		z-index: 1;
		background-color: rgba(255, 255, 255, 0.92);
	}
	.loading-text {
		font-size: 2rem;
		margin: 40px;
	}
</style>
