<script lang="ts">
	import { page } from '$app/stores';

	$: status = $page.status || 500;
	$: message = $page.error?.message || 'Internal Error';
	$: isNotFound = status === 404;
	$: title = isNotFound ? '페이지를 찾을 수 없어요' : '잠시 문제가 생겼어요';
	$: detail = isNotFound
		? '주소가 바뀌었거나, 없는 경로일 수 있습니다.'
		: message === 'Internal Error'
			? '요청을 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
			: message;
</script>

<svelte:head>
	<title>{status} · catea</title>
</svelte:head>

<section class="error-page" aria-labelledby="error-title">
	<div class="glow" aria-hidden="true"></div>
	<div class="grain" aria-hidden="true"></div>

	<div class="panel">
		<p class="code">{status}</p>
		<h1 id="error-title">{title}</h1>
		<p class="detail">{detail}</p>

		<nav class="actions" aria-label="복구 링크">
			<a class="btn btn--primary" href="/">홈으로</a>
			<a class="btn" href="/dami">DAMI</a>
			<button type="button" class="btn" on:click={() => history.back()}>뒤로 가기</button>
		</nav>
	</div>
</section>

<style lang="scss">
	@import '../lib/scss/variable.scss';
	@import '../lib/scss/responsive.scss';

	.error-page {
		position: relative;
		isolation: isolate;
		min-height: calc(100vh - 40px);
		display: grid;
		place-items: center;
		padding: 48px 20px;
		overflow: hidden;
		background:
			radial-gradient(120% 80% at 12% 18%, rgba($semi-black-color, 0.12), transparent 55%),
			radial-gradient(90% 70% at 88% 82%, rgba($semi-black-color, 0.08), transparent 50%),
			linear-gradient(165deg, #f8f4ef 0%, $white-color 45%, #ebe4db 100%);
	}

	.glow {
		position: absolute;
		inset: auto auto 12% 8%;
		width: min(48vw, 420px);
		height: min(48vw, 420px);
		border-radius: 50%;
		background: radial-gradient(circle, rgba($semi-black-color, 0.14), transparent 68%);
		filter: blur(8px);
		animation: drift 12s ease-in-out infinite alternate;
		pointer-events: none;
		z-index: 0;
	}

	.grain {
		position: absolute;
		inset: 0;
		opacity: 0.35;
		pointer-events: none;
		z-index: 0;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E");
		mix-blend-mode: multiply;
	}

	.panel {
		position: relative;
		z-index: 1;
		width: min(520px, 100%);
		text-align: left;
		animation: rise 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.code {
		margin: 0 0 14px;
		font-size: clamp(4.5rem, 14vw, 7rem);
		line-height: 0.85;
		letter-spacing: -0.04em;
		font-weight: 700;
		color: $black-color;
		opacity: 0.92;
		animation: flicker 4.5s ease-in-out infinite;
	}

	h1 {
		margin: 0 0 12px;
		padding: 0;
		font-size: clamp(1.35rem, 3.5vw, 1.85rem);
		font-weight: 700;
		color: $black-color;
	}

	.detail {
		margin: 0 0 28px;
		max-width: 36ch;
		font-size: 0.95rem;
		line-height: 1.55;
		color: rgba($black-color, 0.72);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.btn,
	a.btn {
		appearance: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 108px;
		padding: 11px 16px;
		margin: 0;
		border: 1.5px solid rgba($black-color, 0.35);
		border-radius: 4px;
		background: transparent;
		color: $black-color !important;
		font: inherit;
		font-size: 0.92rem;
		font-weight: 700;
		text-decoration: none;
		box-shadow: none !important;
		cursor: pointer;
		transition:
			transform 0.2s ease,
			background 0.2s ease,
			color 0.2s ease,
			border-color 0.2s ease;
	}

	.btn:hover,
	a.btn:hover {
		transform: translateY(-1px);
		background: rgba($black-color, 0.06);
		box-shadow: none !important;
	}

	.btn--primary,
	a.btn--primary {
		background: $semi-black-color;
		border-color: $semi-black-color;
		color: $white-color !important;
	}

	.btn--primary:hover,
	a.btn--primary:hover {
		background: darken($semi-black-color, 6%);
		border-color: darken($semi-black-color, 6%);
		color: $white-color !important;
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(18px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes drift {
		from {
			transform: translate(0, 0) scale(1);
		}
		to {
			transform: translate(36px, -22px) scale(1.08);
		}
	}

	@keyframes flicker {
		0%,
		100% {
			opacity: 0.92;
		}
		48% {
			opacity: 0.92;
		}
		50% {
			opacity: 0.72;
		}
		52% {
			opacity: 0.96;
		}
	}

	@include mobile {
		.error-page {
			min-height: 100vh;
			padding: 36px 16px;
		}

		.panel {
			text-align: center;
		}

		.detail {
			margin-left: auto;
			margin-right: auto;
		}

		.actions {
			justify-content: center;
		}
	}
</style>
