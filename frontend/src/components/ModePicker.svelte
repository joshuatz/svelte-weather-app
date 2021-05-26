<script lang="ts">
	import { DisplayMode } from '../store';
</script>

<div class="card card-slim shadow-sm">
	<label for="mode-selector">Display Mode:</label>
	<select
		id="mode-selector"
		class="form-control shadow-sm"
		bind:value={$DisplayMode}
	>
		<option value="Standard">Standard</option>
		<option value="Cards">Cards</option>
	</select>
</div>

<style>
	select {
		max-width: 200px;
		height: 1.8rem;
		margin: 8px auto auto 8px;
	}
</style>
