<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Server, type DamiFeedback } from '$lib/modules/firebase';
	import { formatDamiDate, formatDamiDuration } from '$lib/modules/damiAuth';
	import LoadingBar from '$lib/sources/LoadingBar.svelte';

	const ADMIN_KEY = 'dami-admin-unlocked-v1';

	let items: DamiFeedback[] = [];
	let loading = true;
	let error = '';
	let unsubscribe: (() => void) | null = null;

	onMount(() => {
		if (sessionStorage.getItem(ADMIN_KEY) !== '1') {
			goto('/dami');
			return;
		}
		unsubscribe = Server.subscribeDamiFeedbacks(
			(next) => {
				items = next;
				loading = false;
				error = '';
			},
			(err) => {
				console.error(err);
				error = '제출된 피드백을 불러오지 못했습니다.';
				loading = false;
			}
		);
	});

	onDestroy(() => {
		unsubscribe?.();
	});

	const reload = () => {
		loading = true;
		error = '';
		unsubscribe?.();
		unsubscribe = Server.subscribeDamiFeedbacks(
			(next) => {
				items = next;
				loading = false;
				error = '';
			},
			(err) => {
				console.error(err);
				error = '제출된 피드백을 불러오지 못했습니다.';
				loading = false;
			}
		);
	};
</script>

<svelte:head>
	<title>관리자 · DAMI</title>
</svelte:head>

<div class="content">
	<section class="block">
		<div class="head">
			<p class="section-label">제출된 피드백</p>
			<button type="button" class="action-btn" on:click={reload} disabled={loading}>새로고침</button>
		</div>

		{#if loading}
			<LoadingBar label="제출된 피드백 불러오는 중" />
		{:else if error}
			<p class="error">{error}</p>
		{:else if items.length === 0}
			<p class="muted">아직 제출된 피드백이 없습니다.</p>
		{:else}
			<ul class="list">
				{#each items as item}
					<li class="card">
						<div class="meta">
							<strong>{item.nickname || '익명'}</strong>
							<span>{formatDamiDate(item.createdAt)}</span>
							{#if item.durationMs}
								<span>{formatDamiDuration(item.durationMs)}</span>
							{/if}
							<span>{item.url ? '영상 포함' : '글만'}</span>
						</div>
						{#if item.body}
							<p class="note">{item.body}</p>
						{/if}
						{#if item.url}
							<video class="video" src={item.url} controls preload="metadata"></video>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</section>
</div>

<style lang="scss">
	@import '../../../lib/scss/variable.scss';

	.content {
		max-width: 960px;
		margin: 0 auto;
		padding: 40px 24px 0;
	}

	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 18px;
	}

	.section-label {
		margin: 0;
		font-size: 0.72rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba($black-color, 0.4);
	}

	.muted {
		color: rgba($black-color, 0.55);
	}

	.error {
		color: #c0392b;
	}

	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.card {
		padding: 18px;
		border: 1.5px solid rgba($black-color, 0.18);
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 10px 16px;
		margin-bottom: 10px;
		font-size: 0.85rem;
		color: rgba($black-color, 0.55);

		strong {
			color: $black-color;
		}
	}

	.note {
		margin: 0 0 12px;
		font-size: 0.92rem;
		line-height: 1.6;
		color: rgba($black-color, 0.75);
		white-space: pre-wrap;
	}

	.video {
		display: block !important;
		width: 100% !important;
		max-width: none !important;
		margin: 0 !important;
		background: #141414;
		border-radius: 0 !important;
		box-shadow: none !important;
	}

	.action-btn {
		padding: 10px 16px;
		border: 1.5px solid rgba($black-color, 0.28);
		background: transparent;
		color: $black-color;
		font-family: inherit;
		cursor: pointer;

		&:hover:not(:disabled) {
			background: $black-color;
			color: #fff;
		}

		&:disabled {
			opacity: 0.4;
		}
	}
</style>
