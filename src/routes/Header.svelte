<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import Move from '$lib/sources/Move.svelte';

	let mainOnBlue = false;
	let damiOnBlue = false;
	let postsOnBlue = false;

	const overlaps = (el: Element | null, sectionTop: number, sectionBottom: number) => {
		if (!el) return false;
		const rect = el.getBoundingClientRect();
		const mid = rect.top + rect.height / 2;
		return mid >= sectionTop && mid <= sectionBottom;
	};

	const updateNavTone = () => {
		if (!browser) return;

		const section = document.getElementById('links');
		if (!section || $page.url.pathname !== '/') {
			mainOnBlue = false;
			damiOnBlue = false;
			postsOnBlue = false;
			return;
		}

		const { top, bottom } = section.getBoundingClientRect();
		mainOnBlue = overlaps(document.querySelector('[data-nav="main"]'), top, bottom);
		damiOnBlue = overlaps(document.querySelector('[data-nav="dami"]'), top, bottom);
		postsOnBlue = overlaps(document.querySelector('[data-nav="posts"]'), top, bottom);
	};

	onMount(() => {
		updateNavTone();
		window.addEventListener('scroll', updateNavTone, { passive: true });
		window.addEventListener('resize', updateNavTone);

		return () => {
			window.removeEventListener('scroll', updateNavTone);
			window.removeEventListener('resize', updateNavTone);
		};
	});

	$: if (browser) {
		$page.url.pathname;
		updateNavTone();
	}
</script>

<header>
	<nav id="moveSector">
		<ul>
			<li data-nav="main"><Move to="/" name="메인" onBlue={mainOnBlue} /></li>
			<li data-nav="dami"><Move to="/dami/" name="DAMI" onBlue={damiOnBlue} /></li>
			<li data-nav="posts"><Move to="/posts/" name="글" onBlue={postsOnBlue} /></li>
		</ul>
	</nav>
</header>

<style lang="scss">
	header {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		z-index: 100;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		padding: 28px 20px;
		background: transparent;
		border: none;
		pointer-events: none;
	}

	#moveSector,
	ul,
	li,
	:global(header button) {
		pointer-events: auto;
	}

	ul {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 2px;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	@media (max-width: 767px) {
		header {
			padding: 20px 14px;
		}
	}
</style>
