<script lang="ts">
	import Footer from './Footer.svelte';
	import Header from './Header.svelte';
	import { page } from '$app/stores';
	import './styles.scss';

	$: isHome = $page.url.pathname === '/';
	$: isDami = $page.url.pathname.startsWith('/dami');
	$: hideFooter = isHome || isDami || $page.url.pathname.startsWith('/posts');
</script>

<div class="app" class:app--dami={isDami}>
	<main>
		<div id="article" class:full-bleed={isHome || isDami} class:dami-bleed={isDami}>
			<slot />
		</div>

		{#if !hideFooter}
			<Footer />
		{/if}
	</main>

	<Header />
</div>

<style lang="scss" global>
	@use './styles.scss';
	@import '../lib/scss/responsive.scss';

	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.app--dami,
	#article.dami-bleed {
		background: #161412;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	#article {
		margin: 10px;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	#article.full-bleed {
		margin: 0;
	}
</style>
