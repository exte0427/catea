<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Server, type DamiFeedback } from '$lib/modules/firebase';
	import {
		canAttemptFeedbackOpen,
		canOpenFeedbackByDevice,
		formatDamiDate,
		getDamiAuthorId,
		isPasswordProtectedFeedback
	} from '$lib/modules/damiAuth';
	import LoadingBar from '$lib/sources/LoadingBar.svelte';

	let items: DamiFeedback[] = [];
	let loading = true;
	let error = '';
	let authorId = '';
	let toast = '';
	let unsubscribe: (() => void) | null = null;

	onMount(() => {
		authorId = getDamiAuthorId();
		unsubscribe = Server.subscribeDamiFeedbacks(
			(next) => {
				items = next;
				loading = false;
				error = '';
			},
			(err) => {
				console.error(err);
				error = '피드백 목록을 불러오지 못했습니다.';
				loading = false;
			}
		);
	});

	onDestroy(() => {
		unsubscribe?.();
	});

	const openItem = (item: DamiFeedback) => {
		if (canAttemptFeedbackOpen(item, authorId)) {
			goto(`/dami/feedback/${item.id}`);
			return;
		}
		if (item.nickname?.trim() && !item.passwordHash) {
			toast = '닉네임만 있고 비밀번호가 없어, 작성한 기기에서만 열 수 있습니다.';
		} else if (isPasswordProtectedFeedback(item)) {
			toast = '비밀번호로 열람할 수 있습니다.';
		} else {
			toast = '닉네임·비밀번호가 없는 피드백은 작성한 기기에서만 열 수 있습니다.';
		}
		setTimeout(() => {
			toast = '';
		}, 2800);
	};

	const isMineRow = (item: DamiFeedback) =>
		canOpenFeedbackByDevice(item, authorId) ||
		(!!authorId && item.authorId === authorId && isPasswordProtectedFeedback(item));
</script>

<svelte:head>
	<title>피드백 · DAMI</title>
</svelte:head>

<div class="content">
	<section class="block">
		{#if loading}
			<LoadingBar label="피드백 목록 불러오는 중" />
		{:else if error}
			<p class="error">{error}</p>
		{:else if items.length === 0}
			<p class="muted">아직 등록된 피드백이 없습니다.</p>
		{:else}
			<ul class="board">
				{#each items as item}
					<li>
						<button
							type="button"
							class="board-row"
							class:mine={isMineRow(item)}
							on:click={() => openItem(item)}
						>
							<span class="board-name">
								{item.nickname || '익명'}
								{#if isPasswordProtectedFeedback(item)}
									<span class="lock-tag">잠금</span>
								{/if}
							</span>
							<span class="board-date">{formatDamiDate(item.createdAt)}</span>
						</button>
					</li>
				{/each}
			</ul>
		{/if}

		{#if toast}
			<p class="toast">{toast}</p>
		{/if}
	</section>
</div>

<style lang="scss">
	@import '../../../lib/scss/dami.scss';

	.content {
		max-width: 960px;
		margin: 0 auto;
		padding: 40px 24px 0;
	}

	.muted {
		color: rgba($black-color, 0.55);
	}

	.error {
		color: #c0392b;
	}

	.board {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid rgba($black-color, 0.14);
	}

	.board-row {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 16px 4px;
		border: 0;
		border-bottom: 1px solid rgba($black-color, 0.14);
		background: transparent;
		font-family: inherit;
		cursor: pointer;
		text-align: left;

		&:hover {
			background: rgba($black-color, 0.03);
		}

		&.mine .board-name {
			font-weight: 700;
		}
	}

	.board-name {
		display: inline-flex;
		align-items: center;
		gap: 0.35em;
		font-size: 1rem;
		color: $black-color;
	}

	.lock-tag {
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		padding: 0.15em 0.45em;
		border: 1px solid rgba($black-color, 0.22);
		color: rgba($black-color, 0.55);
	}

	.board-date {
		flex-shrink: 0;
		font-size: 0.85rem;
		color: rgba($black-color, 0.5);
	}

	.toast {
		margin-top: 18px;
		padding: 12px 14px;
		border: 1.5px solid rgba($black-color, 0.18);
		font-size: 0.9rem;
		color: rgba($black-color, 0.75);
	}
</style>
