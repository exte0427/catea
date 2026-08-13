<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import damiLogo from '$lib/images/dami_white.png?url';

	const ADMIN_PASSWORD = 'skylover20';
	const ADMIN_KEY = 'dami-admin-unlocked-v1';

	let adminUnlocked = false;
	let showPasswordModal = false;
	let passwordInput = '';
	let passwordError = '';
	let pendingTarget: '/dami/admin' | '/dami/analyze' | null = null;

	$: path = $page.url.pathname.replace(/\/$/, '') || '/';
	$: isMain = path === '/dami';
	$: isFeedback = path.startsWith('/dami/feedback');
	$: isWrite = path === '/dami/feedback/write';
	$: isAdmin = path === '/dami/admin';
	$: isAnalyze = path === '/dami/analyze';
	$: isSurvey = path === '/dami/survey';
	$: showFeedbackActions = isFeedback && !isAdmin && !isAnalyze && !isSurvey;

	onMount(() => {
		// 브라우저 세션 동안만 유지 (탭/창을 닫으면 다시 인증)
		adminUnlocked = sessionStorage.getItem(ADMIN_KEY) === '1';
		// 예전 localStorage 잔여값 제거
		localStorage.removeItem(ADMIN_KEY);
	});

	const goMain = () => goto('/dami');
	const goFeedback = () => goto('/dami/feedback');
	const goWrite = () => goto('/dami/feedback/write');
	const goList = () => goto('/dami/feedback');

	const closePasswordModal = () => {
		showPasswordModal = false;
		passwordInput = '';
		passwordError = '';
		pendingTarget = null;
	};

	const onStaffTabClick = (target: '/dami/admin' | '/dami/analyze') => {
		if (adminUnlocked) {
			goto(target);
			return;
		}

		pendingTarget = target;
		passwordInput = '';
		passwordError = '';
		showPasswordModal = true;
	};

	const submitPassword = () => {
		if (passwordInput === ADMIN_PASSWORD) {
			adminUnlocked = true;
			sessionStorage.setItem(ADMIN_KEY, '1');
			localStorage.removeItem(ADMIN_KEY);
			showPasswordModal = false;
			passwordInput = '';
			passwordError = '';
			const dest = pendingTarget ?? '/dami/admin';
			pendingTarget = null;
			goto(dest);
		} else {
			passwordError = '비밀번호가 올바르지 않습니다.';
		}
	};
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
	/>
</svelte:head>

<div class="dami-shell">
	<section class="brand">
		<img class="hero-logo" src={damiLogo} alt="DAMI" />
	</section>

	<nav class="mode-tabs" aria-label="DAMI 모드">
		<button type="button" class="mode-tab" class:active={isMain} on:click={goMain}>메인</button>
		<button
			type="button"
			class="mode-tab"
			class:active={isFeedback && !isSurvey}
			on:click={goFeedback}
		>
			피드백
		</button>
		<button
			type="button"
			class="mode-tab mode-tab--locked"
			class:active={isAdmin}
			class:unlocked={adminUnlocked}
			aria-disabled={!adminUnlocked}
			on:click={() => onStaffTabClick('/dami/admin')}
		>
			피드백 관리
		</button>
		<button
			type="button"
			class="mode-tab mode-tab--locked"
			class:active={isAnalyze}
			class:unlocked={adminUnlocked}
			aria-disabled={!adminUnlocked}
			on:click={() => onStaffTabClick('/dami/analyze')}
		>
			게임 분석
		</button>
	</nav>

	{#if isMain}
		<div
			class="hero-copy"
			in:fly={{ y: 12, duration: 560, opacity: 0, easing: cubicOut }}
			out:fade={{ duration: 220, easing: cubicOut }}
		>
			<p>기형화된 생태계의 <strong>식어버린 포스트아포칼립스의</strong> 세상에서 희망은 있을까요?</p>
			<p><strong>일촉즉발</strong>, 과감한 액션의 탑뷰 어드벤처 게임 다미입니다.</p>
		</div>
	{/if}

	{#if showFeedbackActions}
		<div class="feedback-actions-bar">
			{#if !isWrite}
				<button type="button" class="write-btn" on:click={goWrite}>피드백 작성하기</button>
			{:else}
				<button type="button" class="write-btn write-btn--ghost" on:click={goList}>목록으로</button>
			{/if}
		</div>
	{/if}

	<div class="page-stage">
		{#key path}
			<div
				class="page-panel"
				in:fly={{ y: 18, duration: 520, opacity: 0, easing: cubicOut }}
				out:fade={{ duration: 280, easing: cubicOut }}
			>
				<slot />
			</div>
		{/key}
	</div>
</div>

{#if showPasswordModal}
	<div
		class="modal-backdrop"
		role="button"
		tabindex="0"
		aria-label="모달 닫기"
		on:click={closePasswordModal}
		on:keydown={(e) => e.key === 'Escape' && closePasswordModal()}
	>
		<div
			class="modal"
			role="dialog"
			aria-modal="true"
			aria-labelledby="admin-pw-title"
			on:click|stopPropagation
			on:keydown|stopPropagation
		>
			<h2 id="admin-pw-title">관리자 인증</h2>
			<p>비밀번호를 입력하면 피드백 관리와 게임 분석에 접근할 수 있습니다.</p>
			<form on:submit|preventDefault={submitPassword}>
				<input
					type="password"
					bind:value={passwordInput}
					placeholder="비밀번호"
					autocomplete="current-password"
				/>
				{#if passwordError}
					<p class="password-error">{passwordError}</p>
				{/if}
				<div class="modal-actions">
					<button type="button" class="action-btn" on:click={closePasswordModal}>
						취소
					</button>
					<button type="submit" class="action-btn action-btn--primary">확인</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style lang="scss">
	@import '../../lib/scss/dami.scss';
	@import '../../lib/scss/responsive.scss';

	.dami-shell {
		width: 100%;
		min-height: 100vh;
		padding-bottom: 96px;
		background: $dami-bg;
		color: $dami-text;
		font-family: 'Pretendard Variable', Pretendard, 'GMarketSans', sans-serif;

		:global(strong) {
			background: transparent;
			color: $dami-accent-bright;
			font-weight: 700;
		}

		:global(.loading .track) {
			background: rgba(255, 255, 255, 0.12);
		}

		:global(.loading .bar) {
			background: $dami-accent;
		}

		:global(.loading p) {
			color: $dami-muted;
		}

		:global(input),
		:global(textarea),
		:global(select) {
			background: rgba(255, 255, 255, 0.04);
			color: $dami-text;
			caret-color: $dami-text;
		}
	}

	.mode-tabs {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2px;
		flex-wrap: wrap;
		padding: 8px 24px 20px;
	}

	.mode-tab {
		position: relative;
		padding: 10px 18px;
		border: 0;
		background: transparent;
		color: $dami-faint;
		font-family: inherit;
		font-size: 0.82rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		cursor: pointer;
		transition: color 0.35s cubic-bezier(0.22, 1, 0.36, 1);

		&:after {
			content: '';
			position: absolute;
			left: 18px;
			right: 18px;
			bottom: 4px;
			height: 1px;
			background: $dami-accent-bright;
			transform: scaleX(0);
			transform-origin: center;
			transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
		}

		&:hover {
			color: $dami-text;
		}

		&.active {
			color: $dami-accent-bright;

			&:after {
				transform: scaleX(1);
			}
		}
	}

	.mode-tab--locked {
		opacity: 0.38;
		cursor: pointer;

		&:hover {
			color: $dami-faint;
		}

		&.unlocked {
			opacity: 1;
			cursor: pointer;

			&:hover {
				color: $dami-text;
			}
		}

		&.active {
			opacity: 1;
		}
	}

	.brand {
		width: 100%;
		max-width: 860px;
		margin: 0 auto;
		padding: 48px 24px 4px;
		display: flex;
		justify-content: center;
		box-sizing: border-box;
	}

	.hero-logo {
		display: block !important;
		width: min(420px, 78vw) !important;
		max-width: 420px !important;
		height: auto !important;
		margin: 0 !important;
		padding: 0 !important;
		border-radius: 0 !important;
		object-fit: contain;
		box-shadow: none !important;
		filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.45));
	}

	.hero-copy {
		max-width: 640px;
		margin: 0 auto 8px;
		padding: 0 24px 20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		text-align: center;

		p {
			margin: 0;
			font-size: clamp(0.95rem, 2.2vw, 1.12rem);
			font-weight: 500;
			line-height: 1.85;
			letter-spacing: -0.02em;
			color: $dami-text;
		}
	}

	.write-btn {
		display: inline-flex !important;
		align-items: center;
		justify-content: center;
		margin: 0 !important;
		padding: 12px 22px !important;
		border: 1px solid rgba(244, 240, 234, 0.7) !important;
		border-radius: 0 !important;
		background: transparent !important;
		color: $dami-text !important;
		font-family: inherit;
		font-size: 0.88rem;
		font-weight: 500;
		letter-spacing: 0.04em;
		text-decoration: none !important;
		line-height: 1.2;
		box-shadow: none !important;
		cursor: pointer;

		&:hover {
			background: $dami-text !important;
			border-color: $dami-text !important;
			color: $dami-bg !important;
			transform: none !important;
		}
	}

	.feedback-actions-bar {
		max-width: 860px;
		margin: 0 auto;
		padding: 18px 24px 0;
		display: flex;
		justify-content: center;
	}

	.write-btn--ghost {
		border-color: $dami-line !important;
		color: $dami-muted !important;

		&:hover {
			background: $dami-text !important;
			color: $dami-bg !important;
			border-color: $dami-text !important;
		}
	}

	.page-stage {
		position: relative;
		display: grid;
		align-items: start;
		min-height: 240px;
		overflow: hidden;
	}

	.page-panel {
		grid-area: 1 / 1;
		width: 100%;
		align-self: start;
	}

	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
		background: rgba(0, 0, 0, 0.72);
	}

	.modal {
		width: min(400px, 100%);
		padding: 28px 24px;
		background: #1e1b18;
		border: 1px solid $dami-line;
		color: $dami-text;

		h2 {
			margin: 0 0 8px;
			font-size: 1.2rem;
			font-weight: 700;
			color: $dami-text;
		}

		p {
			margin: 0 0 16px;
			font-size: 0.9rem;
			color: $dami-muted;
		}

		input {
			width: 100%;
			padding: 12px 14px;
			margin-bottom: 12px;
			border: 1px solid $dami-line;
			background: transparent;
			color: $dami-text;
			font-family: inherit;
			font-size: 0.95rem;
			box-sizing: border-box;
		}
	}

	.password-error {
		color: #e07070 !important;
		font-size: 0.85rem !important;
		margin: 0 0 12px !important;
	}

	.modal-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.action-btn {
		padding: 10px 16px;
		border: 1px solid $dami-line;
		background: transparent;
		color: $dami-text;
		font-family: inherit;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;

		&:hover {
			background: $dami-text;
			color: $dami-bg;
			border-color: $dami-text;
		}
	}

	.action-btn--primary {
		background: $dami-accent;
		color: $dami-bg;
		border-color: $dami-accent;
	}

	@include mobile {
		.dami-shell {
			padding-bottom: 72px;
		}

		.mode-tabs {
			padding: 4px 16px 16px;
		}

		.brand {
			padding: 32px 20px 0;
		}

		.hero-logo {
			width: min(280px, 72vw) !important;
		}

		.hero-copy {
			padding: 0 20px 16px;
		}

		.hero-copy p {
			font-size: 0.92rem;
		}

		.mode-tab {
			font-size: 0.76rem;
			padding: 7px 12px;
		}
	}
</style>
