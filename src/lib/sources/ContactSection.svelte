<script lang="ts">
	import { onMount } from 'svelte';
	import { Server } from '$lib/modules/firebase';
	import { Carta, Markdown } from 'carta-md';
	import SmallLoading from '$lib/sources/SmallLoading.svelte';

	export let postId = '0pyNOOKWWrvT0dSJiW5k';

	const carta = new Carta({ sanitizer: false });
	let postData: Server.Post | null = null;

	onMount(() => {
		Server.init();
		Server.getPost(postId).then((post: Server.Post) => {
			postData = post;
		});
	});
</script>

<section class="contact-section">
	<div class="contact-inner">
		<p class="label">Contact</p>

		{#if postData == null}
			<div class="loading">
				<SmallLoading />
			</div>
		{:else}
			<div class="contact-body">
				<Markdown carta={carta} value={postData.desc} />
			</div>
		{/if}
	</div>
</section>

<style lang="scss">
	@import '../scss/variable.scss';
	@import '../scss/responsive.scss';

	.contact-section {
		position: relative;
		z-index: 1;
		padding: 96px 24px 48px;
		background-color: $white-color;
	}

	.contact-inner {
		max-width: 520px;
		margin: 0 auto;
	}

	.label {
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba($black-color, 0.45);
		margin-bottom: 40px;
	}

	.loading {
		display: flex;
		justify-content: center;
		padding: 40px 0;
	}

	.contact-body :global(h2) {
		font-size: 1.05rem;
		font-weight: 700;
		color: $black-color;
		margin: 0 0 14px;
		letter-spacing: -0.02em;
		line-height: 1.4;
	}

	.contact-body :global(h2:not(:first-child)) {
		margin-top: 44px;
		padding-top: 44px;
		border-top: 1px solid rgba($black-color, 0.1);
	}

	.contact-body :global(strong) {
		background-color: transparent;
		color: inherit;
		font-weight: 700;
	}

	.contact-body :global(p) {
		font-size: 0.95rem;
		font-weight: 500;
		line-height: 1.75;
		color: rgba($black-color, 0.82);
		margin: 0;
	}

	.contact-body :global(ul) {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.contact-body :global(li) {
		position: relative;
		padding-left: 18px;
		font-size: 0.95rem;
		font-weight: 500;
		line-height: 1.65;
		color: rgba($black-color, 0.82);
	}

	.contact-body :global(li::before) {
		content: '';
		position: absolute;
		left: 0;
		top: 0.62em;
		width: 5px;
		height: 5px;
		border: 1px solid rgba($black-color, 0.5);
		border-radius: 50%;
		background: transparent;
	}

	.contact-body :global(hr) {
		display: none;
	}

	.contact-body :global(a) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-top: 48px;
		padding: 13px 28px;
		border: 1.5px solid $black-color;
		border-radius: 0;
		background: transparent;
		color: $black-color;
		font-size: 0.9rem;
		font-weight: 500;
		text-decoration: none;
		box-shadow: none;
		transition: background-color 0.2s ease, color 0.2s ease;

		&:hover {
			background-color: $black-color;
			color: $white-color;
			transform: none;
			box-shadow: none;
		}
	}

	@include mobile {
		.contact-section {
			padding: 72px 20px 32px;
		}

		.label {
			margin-bottom: 32px;
		}

		.contact-body :global(h2:not(:first-child)) {
			margin-top: 36px;
			padding-top: 36px;
		}
	}
</style>
