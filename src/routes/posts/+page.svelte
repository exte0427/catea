<script lang="ts">
	import Loading from './../../lib/sources/Loading.svelte';
	import PostCard from '$lib/sources/PostCard.svelte';
	import BusinessCardMaker from '$lib/sources/BusinessCardMaker.svelte';
	import { Server } from '../../lib/modules/firebase';
	import { categoryLabels } from '../../lib/modules/categoryLabels';
	import { beforeUpdate } from 'svelte';

	let posts: Server.Post[] = [];
	let visiblePosts: Server.Post[] = [];
	let searchQuery = '';
	let category = 'all';

	beforeUpdate(() => {
		Server.init();
		Server.getPosts().then((e: Server.Post[]) => {
			posts = e;
		});
	});

	$: visiblePosts = posts.filter((e: Server.Post) => {
		return e.title.includes(searchQuery) && (category == 'all' || e.category == category);
	});
</script>

<svelte:head>
	<title>글 · catea</title>
</svelte:head>

<div class="posts-page">
	<header class="page-header">
		<p class="label">글</p>
		<h1>글 모음</h1>
	</header>

	<div class="filters">
		<input
			type="text"
			name="searchQuery"
			id="searchQuery"
			placeholder="검색"
			autocomplete="off"
			bind:value={searchQuery}
		/>
		<select name="category" id="category" bind:value={category}>
			{#each Object.entries(categoryLabels) as [value, label]}
				<option {value}>{label}</option>
			{/each}
		</select>
	</div>

	<div class="post-list">
		{#if posts.length == 0}
			<div class="loading-wrap">
				<Loading />
			</div>
		{:else if visiblePosts.length == 0}
			<p class="empty">검색 결과가 없습니다.</p>
		{:else}
			{#each visiblePosts as post}
				<PostCard postData={post} />
			{/each}
		{/if}
	</div>

	<BusinessCardMaker />
</div>

<style lang="scss">
	@import '../../lib/scss/variable.scss';
	@import '../../lib/scss/responsive.scss';

	.posts-page {
		max-width: 720px;
		margin: 0 auto;
		padding: 48px 24px 80px;
	}

	.page-header {
		margin-bottom: 40px;
	}

	.label {
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba($black-color, 0.4);
		margin: 0 0 12px;
	}

	h1 {
		margin: 0;
		font-size: 1.6rem;
		font-weight: 700;
		color: $black-color;
		letter-spacing: -0.02em;
	}

	.filters {
		display: flex;
		gap: 10px;
		margin-bottom: 32px;
	}

	#searchQuery,
	#category {
		font-family: inherit;
		font-size: 0.9rem;
		font-weight: 500;
		color: $black-color;
		background: transparent;
		border: 1.5px solid rgba($black-color, 0.2);
		border-radius: 0;
		padding: 10px 14px;
		box-shadow: none;
		transition: border-color 0.2s ease;

		&:focus {
			outline: none;
			border-color: rgba($black-color, 0.55);
		}
	}

	#searchQuery {
		flex: 1;
		min-width: 0;
	}

	#category {
		flex-shrink: 0;
		cursor: pointer;
	}

	.post-list {
		display: flex;
		flex-direction: column;
		border-top: 1px solid rgba($black-color, 0.12);
	}

	.loading-wrap {
		display: flex;
		justify-content: center;
		padding: 48px 0;
	}

	.empty {
		padding: 48px 0;
		text-align: center;
		font-size: 0.95rem;
		font-weight: 500;
		color: rgba($black-color, 0.45);
	}

	@include mobile {
		.posts-page {
			padding: 36px 20px 64px;
		}

		.filters {
			flex-direction: column;
		}

		#category {
			width: 100%;
		}
	}
</style>
