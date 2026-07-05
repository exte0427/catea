<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import PostsGate from '$lib/sources/PostsGate.svelte';
	import { hasPostAccess } from '$lib/modules/postAccess';

	let ready = false;
	let unlocked = false;

	onMount(() => {
		unlocked = hasPostAccess();
		ready = true;
	});

	const handleSuccess = () => {
		unlocked = true;
	};
</script>

{#if ready}
	{#if unlocked}
		<slot />
	{:else}
		<PostsGate on:success={handleSuccess} />
	{/if}
{:else if !browser}
	<slot />
{/if}
