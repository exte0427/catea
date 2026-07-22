<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import damiLogo from '$lib/images/dami_white.png?url';

	const demoDriveUrl =
		'https://drive.google.com/drive/folders/1m8DjJFu5g8Uu_xjtAkDu4qLTzEwh5YCr?usp=sharing';
	const ADMIN_PASSWORD = 'skylover20';
	const ADMIN_KEY = 'dami-admin-unlocked-v1';

	let adminUnlocked = false;
	let adminClickCount = 0;
	let adminClickTimer: ReturnType<typeof setTimeout> | null = null;
	let showPasswordModal = false;
	let passwordInput = '';
	let passwordError = '';
	let slideDir = 1;

	$: path = $page.url.pathname.replace(/\/$/, '') || '/';
	$: isMain = path === '/dami';
	$: isFeedback = path.startsWith('/dami/feedback');
	$: isWrite = path === '/dami/feedback/write';
	$: isAdmin = path === '/dami/admin';
	$: showFeedbackActions = isFeedback && !isAdmin;

	onMount(() => {
		// 브라우저 세션 동안만 유지 (탭/창을 닫으면 다시 인증)
		adminUnlocked = sessionStorage.getItem(ADMIN_KEY) === '1';
		// 예전 localStorage 잔여값 제거
		localStorage.removeItem(ADMIN_KEY);
	});

	const goMain = () => {
		slideDir = -1;
		goto('/dami');
	};
	const goFeedback = () => {
		slideDir = path.startsWith('/dami/feedback') ? 0 : 1;
		goto('/dami/feedback');
	};
	const goWrite = () => {
		slideDir = 1;
		goto('/dami/feedback/write');
	};
	const goList = () => {
		slideDir = -1;
		goto('/dami/feedback');
	};

	const onAdminTabClick = () => {
		if (adminUnlocked) {
			slideDir = 1;
			goto('/dami/admin');
			return;
		}

		adminClickCount += 1;
		if (adminClickTimer) clearTimeout(adminClickTimer);
		adminClickTimer = setTimeout(() => {
			adminClickCount = 0;
		}, 700);

		if (adminClickCount >= 2) {
			adminClickCount = 0;
			passwordInput = '';
			passwordError = '';
			showPasswordModal = true;
		}
	};

	const submitPassword = () => {
		if (passwordInput === ADMIN_PASSWORD) {
			adminUnlocked = true;
			sessionStorage.setItem(ADMIN_KEY, '1');
			localStorage.removeItem(ADMIN_KEY);
			showPasswordModal = false;
			passwordInput = '';
			passwordError = '';
			slideDir = 1;
			goto('/dami/admin');
		} else {
			passwordError = '비밀번호가 올바르지 않습니다.';
		}
	};
</script>

<div class="dami-shell">
	<section class="illustration">
		<img class="hero-logo" src={damiLogo} alt="DAMI" />
		<a class="demo-btn" href={demoDriveUrl} target="_blank" rel="noopener noreferrer">
			데모/플레이 풀 영상 받기
		</a>

		<nav class="mode-tabs" aria-label="DAMI 모드">
			<button type="button" class="mode-tab" class:active={isMain} on:click={goMain}>메인</button>
			<button type="button" class="mode-tab" class:active={isFeedback && !isAdmin} on:click={goFeedback}>
				피드백
			</button>
			<button
				type="button"
				class="mode-tab mode-tab--admin"
				class:active={isAdmin}
				class:unlocked={adminUnlocked}
				on:click={onAdminTabClick}
			>
				관리자 모드
			</button>
		</nav>
	</section>

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
				in:fly={{ x: slideDir >= 0 ? 56 : -56, duration: 320, opacity: 0 }}
				out:fly={{ x: slideDir >= 0 ? -56 : 56, duration: 240, opacity: 0 }}
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
		on:click={() => (showPasswordModal = false)}
		on:keydown={(e) => e.key === 'Escape' && (showPasswordModal = false)}
	>
		<div
			class="modal"
			role="dialog"
			aria-modal="true"
			aria-labelledby="admin-pw-title"
			on:click|stopPropagation
			on:keydown|stopPropagation
		>
			<h2 id="admin-pw-title">관리자 모드</h2>
			<p>비밀번호를 입력하세요.</p>
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
					<button type="button" class="action-btn" on:click={() => (showPasswordModal = false)}>
						취소
					</button>
					<button type="submit" class="action-btn action-btn--primary">확인</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style lang="scss">
	@import '../../lib/scss/variable.scss';
	@import '../../lib/scss/responsive.scss';

	.dami-shell {
		width: 100%;
		padding-bottom: 96px;
	}

	.illustration {
		width: 100%;
		max-width: 960px;
		margin: 0 auto;
		min-height: 280px;
		padding: 56px 24px 40px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 22px;
		background: #141414;
		overflow: hidden;
		box-sizing: border-box;
	}

	.hero-logo {
		display: block !important;
		width: min(280px, 58vw) !important;
		max-width: 280px !important;
		height: auto !important;
		margin: 0 !important;
		padding: 0 !important;
		border-radius: 0 !important;
		object-fit: contain;
		box-shadow: none !important;
	}

	.demo-btn,
	.write-btn {
		display: inline-flex !important;
		align-items: center;
		justify-content: center;
		margin: 0 !important;
		padding: 12px 22px !important;
		border: 1.5px solid #fff !important;
		border-radius: 14px !important;
		background: transparent !important;
		color: #fff !important;
		font-family: inherit;
		font-size: 0.92rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		text-decoration: none !important;
		line-height: 1.2;
		box-shadow: none !important;
		cursor: pointer;

		&:hover {
			background: rgba(255, 255, 255, 0.08) !important;
			border-color: #fff !important;
			color: #fff !important;
		}
	}

	.feedback-actions-bar {
		max-width: 960px;
		margin: 0 auto;
		padding: 18px 24px 0;
		display: flex;
		justify-content: center;
	}

	.write-btn {
		border-color: $black-color !important;
		color: $black-color !important;

		&:hover {
			background: $black-color !important;
			color: #fff !important;
			border-color: $black-color !important;
		}
	}

	.write-btn--ghost {
		border-color: rgba($black-color, 0.35) !important;
		color: rgba($black-color, 0.7) !important;

		&:hover {
			background: $black-color !important;
			color: #fff !important;
			border-color: $black-color !important;
		}
	}

	.page-stage {
		position: relative;
		overflow: hidden;
		min-height: 240px;
	}

	.page-panel {
		width: 100%;
	}

	.mode-tabs {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		flex-wrap: wrap;
	}

	.mode-tab {
		padding: 8px 14px;
		border: 1px solid rgba(255, 255, 255, 0.28);
		background: transparent;
		color: rgba(255, 255, 255, 0.72);
		font-family: inherit;
		font-size: 0.84rem;
		font-weight: 500;
		cursor: pointer;

		&:hover {
			color: #fff;
			border-color: rgba(255, 255, 255, 0.55);
		}

		&.active {
			color: #141414;
			background: #f2f2f2;
			border-color: #f2f2f2;
		}
	}

	.mode-tab--admin {
		opacity: 0.42;
		cursor: default;

		&.unlocked {
			opacity: 1;
			cursor: pointer;
		}

		&.active {
			opacity: 1;
		}
	}

	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 24px;
		background: rgba(0, 0, 0, 0.55);
	}

	.modal {
		width: min(400px, 100%);
		padding: 28px 24px;
		background: #fff;
		border: 1.5px solid rgba($black-color, 0.2);

		h2 {
			margin: 0 0 8px;
			font-size: 1.2rem;
			font-weight: 700;
		}

		p {
			margin: 0 0 16px;
			font-size: 0.9rem;
			color: rgba($black-color, 0.65);
		}

		input {
			width: 100%;
			padding: 12px 14px;
			margin-bottom: 12px;
			border: 1.5px solid rgba($black-color, 0.22);
			font-family: inherit;
			font-size: 0.95rem;
			box-sizing: border-box;
		}
	}

	.password-error {
		color: #c0392b !important;
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
		border: 1.5px solid rgba($black-color, 0.28);
		background: transparent;
		color: $black-color;
		font-family: inherit;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;

		&:hover {
			background: $black-color;
			color: #fff;
			border-color: $black-color;
		}
	}

	.action-btn--primary {
		background: $black-color;
		color: #fff;
		border-color: $black-color;
	}

	@include mobile {
		.dami-shell {
			padding-bottom: 72px;
		}

		.illustration {
			max-width: 100%;
			min-height: 240px;
			padding: 44px 20px 32px;
			gap: 18px;
		}

		.hero-logo {
			width: min(220px, 62vw) !important;
		}

		.demo-btn {
			font-size: 0.86rem;
			padding: 11px 18px !important;
		}

		.mode-tab {
			font-size: 0.78rem;
			padding: 7px 11px;
		}
	}
</style>
