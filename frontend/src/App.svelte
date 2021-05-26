<script lang="ts">
	import ModePicker from './components/ModePicker.svelte';
	import ObscureLoader from './components/UI/ObscureLoader.svelte';

	let isLoading = true;
</script>

<main>
	<!-- Display mode picker -->
	<ModePicker />
	{#if isLoading}
		<ObscureLoader />
	{/if}
</main>
