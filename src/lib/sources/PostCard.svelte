<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Server } from '$lib/modules/firebase';
	import { PageModule } from '$lib/modules/pageModule';
	import { getCategoryLabel } from '$lib/modules/categoryLabels';

	export let postData: Server.Post;

	const move = () => {
		goto(`/posts/${postData.id}`);
	};
</script>

<button class="post-card" on:click={move}>
	<div class="meta">
		<span class="category">{getCategoryLabel(postData.category)}</span>
		<span class="date">{PageModule.getDate(postData.date)}</span>
	</div>
	<strong class="title">{postData.title}</strong>
</button>

<style lang="scss">
	@import '../../lib/scss/variable.scss';

	.post-card {
		display: block;
		width: 100%;
		padding: 18px 0;
		border: none;
		border-bottom: 1px solid rgba($black-color, 0.12);
		background: transparent;
		text-align: left;
		cursor: pointer;
		font-family: inherit;
		box-shadow: none;
		margin: 0;
		border-radius: 0;
		transition: opacity 0.2s ease;

		&:hover {
			opacity: 0.55;
			transform: none;
			box-shadow: none;
			background: transparent;
		}
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 8px;
	}

	.category {
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba($black-color, 0.45);
		background: transparent;
		padding: 0;
		border-radius: 0;
	}

	.date {
		font-size: 0.78rem;
		font-weight: 500;
		color: rgba($black-color, 0.35);
	}

	.title {
		display: block;
		font-size: 1.05rem;
		font-weight: 700;
		color: $black-color;
		line-height: 1.45;
		letter-spacing: -0.02em;
		background: transparent;
	}
</style>
