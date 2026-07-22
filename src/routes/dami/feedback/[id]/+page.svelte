<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Server, type DamiFeedback } from '$lib/modules/firebase';
	import {
		canOpenFeedbackByDevice,
		formatDamiDate,
		formatDamiDuration,
		getDamiAuthorId,
		hashDamiPassword,
		isPasswordProtectedFeedback
	} from '$lib/modules/damiAuth';

	let item: DamiFeedback | null = null;
	let loading = true;
	let error = '';
	let authorId = '';
	let viewUnlocked = false;
	let passwordInput = '';
	let passwordError = '';
	let editing = false;
	let editBody = '';
	let editNickname = '';
	let saving = false;
	let message = '';

	$: id = $page.params.id;
	$: passwordProtected = item ? isPasswordProtectedFeedback(item) : false;
	$: canManage = viewUnlocked && passwordProtected;

	onMount(async () => {
		authorId = getDamiAuthorId();
		try {
			const found = await Server.getDamiFeedback(id);
			if (!found) {
				error = '피드백을 찾을 수 없습니다.';
				return;
			}

			item = found;
			editBody = found.body;
			editNickname = found.nickname;

			if (isPasswordProtectedFeedback(found)) {
				// 닉네임+비번: 기기 자동 통과 없음, 비밀번호 필요
				viewUnlocked = false;
			} else if (canOpenFeedbackByDevice(found, authorId)) {
				viewUnlocked = true;
			} else if (found.nickname?.trim() && !found.passwordHash) {
				error = '닉네임만 설정되어 비밀번호가 없습니다. 작성한 기기에서만 열 수 있습니다.';
				item = null;
			} else {
				error = '닉네임·비밀번호가 없는 피드백은 작성한 기기에서만 열 수 있습니다.';
				item = null;
			}
		} catch (err) {
			console.error(err);
			error = '피드백을 불러오지 못했습니다.';
		} finally {
			loading = false;
		}
	});

	const unlock = async () => {
		if (!item?.passwordHash) return;
		const hash = await hashDamiPassword(passwordInput);
		if (hash === item.passwordHash) {
			viewUnlocked = true;
			passwordError = '';
			passwordInput = '';
		} else {
			passwordError = '비밀번호가 올바르지 않습니다.';
		}
	};

	const saveEdit = async () => {
		if (!item || !canManage) return;
		saving = true;
		message = '';
		try {
			await Server.updateDamiFeedback(item.id, {
				body: editBody.trim(),
				nickname: editNickname.trim(),
				passwordHash: item.passwordHash,
				url: item.url,
				authorId: item.authorId,
				durationMs: item.durationMs
			});
			item = {
				...item,
				body: editBody.trim(),
				nickname: editNickname.trim()
			};
			editing = false;
			message = '수정되었습니다.';
		} catch (err) {
			console.error(err);
			message = '수정에 실패했습니다.';
		} finally {
			saving = false;
		}
	};

	const remove = async () => {
		if (!item || !canManage) return;
		if (!confirm('이 피드백을 삭제할까요?')) return;
		saving = true;
		try {
			await Server.deleteDamiFeedback(item.id);
			goto('/dami/feedback');
		} catch (err) {
			console.error(err);
			message = '삭제에 실패했습니다.';
			saving = false;
		}
	};
</script>

<svelte:head>
	<title>피드백 상세 · DAMI</title>
</svelte:head>

<div class="content">
	<section class="block">
		<a class="back" href="/dami/feedback">← 목록</a>

		{#if loading}
			<p class="muted">불러오는 중…</p>
		{:else if error}
			<p class="error">{error}</p>
		{:else if item && !viewUnlocked && passwordProtected}
			<div class="gate">
				<p class="gate-title">{item.nickname}</p>
				<p class="gate-desc">이 피드백은 비밀번호로 열람할 수 있습니다.</p>
				<input
					type="password"
					bind:value={passwordInput}
					placeholder="비밀번호"
					on:keydown={(e) => e.key === 'Enter' && unlock()}
				/>
				{#if passwordError}
					<p class="error">{passwordError}</p>
				{/if}
				<button type="button" class="action-btn action-btn--primary" on:click={unlock}>열람</button>
			</div>
		{:else if item && viewUnlocked}
			<div class="meta">
				<strong>{item.nickname || '익명'}</strong>
				<span>{formatDamiDate(item.createdAt)}</span>
				{#if item.durationMs}
					<span>{formatDamiDuration(item.durationMs)}</span>
				{/if}
			</div>

			{#if item.url}
				<video class="video" src={item.url} controls preload="metadata"></video>
			{/if}

			{#if editing}
				<label>
					<span>닉네임</span>
					<input type="text" bind:value={editNickname} maxlength="40" />
				</label>
				<label>
					<span>피드백 글</span>
					<textarea bind:value={editBody} rows="5" maxlength="2000"></textarea>
				</label>
				<div class="actions">
					<button type="button" class="action-btn action-btn--primary" disabled={saving} on:click={saveEdit}>
						저장
					</button>
					<button type="button" class="action-btn" on:click={() => (editing = false)}>취소</button>
				</div>
			{:else if item.body}
				<p class="body">{item.body}</p>
			{/if}

			{#if canManage}
				<div class="actions">
					<button type="button" class="action-btn" on:click={() => (editing = true)}>수정</button>
					<button type="button" class="action-btn action-btn--danger" disabled={saving} on:click={remove}>
						삭제
					</button>
				</div>
			{:else if !passwordProtected}
				<p class="hint">닉네임·비밀번호를 설정하지 않아 수정·삭제가 불가능합니다.</p>
			{/if}

			{#if message}
				<p class="message">{message}</p>
			{/if}
		{/if}
	</section>
</div>

<style lang="scss">
	@import '../../../../lib/scss/variable.scss';

	.content {
		max-width: 960px;
		margin: 0 auto;
		padding: 40px 24px 0;
	}

	.back {
		display: inline-block !important;
		margin: 0 0 20px !important;
		color: rgba($black-color, 0.55) !important;
		text-decoration: none !important;
		font-size: 0.9rem;
		background: transparent !important;
		box-shadow: none !important;
		padding: 0 !important;
		border: 0 !important;
	}

	.muted {
		color: rgba($black-color, 0.55);
	}

	.error {
		color: #c0392b;
	}

	.gate {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 10px;
		max-width: 360px;
	}

	.gate-title {
		margin: 0;
		font-size: 1.15rem;
		font-weight: 700;
		color: $black-color;
	}

	.gate-desc {
		margin: 0;
		font-size: 0.9rem;
		color: rgba($black-color, 0.6);
	}

	.gate input {
		width: 100%;
		padding: 10px 12px;
		border: 1.5px solid rgba($black-color, 0.22);
		font-family: inherit;
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 10px 16px;
		margin-bottom: 16px;
		font-size: 0.88rem;
		color: rgba($black-color, 0.55);

		strong {
			color: $black-color;
		}
	}

	.video {
		display: block !important;
		width: 100% !important;
		max-width: none !important;
		margin: 0 0 18px !important;
		background: #141414;
		border-radius: 0 !important;
		box-shadow: none !important;
	}

	.body {
		margin: 0 0 20px;
		font-size: 0.98rem;
		line-height: 1.7;
		color: rgba($black-color, 0.82);
		white-space: pre-wrap;
	}

	.hint {
		margin: 0;
		font-size: 0.88rem;
		color: rgba($black-color, 0.5);
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: 12px;
		font-size: 0.75rem;
		color: rgba($black-color, 0.55);

		input,
		textarea {
			padding: 10px 12px;
			border: 1.5px solid rgba($black-color, 0.22);
			font-family: inherit;
			font-size: 0.92rem;
		}
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 12px;
	}

	.message {
		margin-top: 14px;
		font-size: 0.9rem;
		color: #1f7a4d;
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

	.action-btn--primary {
		background: $black-color;
		color: #fff;
		border-color: $black-color;
	}

	.action-btn--danger {
		border-color: #c0392b;
		color: #c0392b;

		&:hover:not(:disabled) {
			background: #c0392b;
			color: #fff;
		}
	}
</style>
