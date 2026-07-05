<script>
	import FloatingShapes from '$lib/sources/FloatingShapes.svelte';
	import ProfileLinks from '$lib/sources/ProfileLinks.svelte';

	const scrollToLinks = () => {
		document.getElementById('links')?.scrollIntoView({ behavior: 'smooth' });
	};
</script>

<svelte:head>
	<title>임준상 · catea</title>
	<meta name="description" content="공명을 업으로 삼고 싶습니다. 제작자 임준상입니다." />
</svelte:head>

<div class="page">
	<section class="home">
		<FloatingShapes
			speed={0.7}
			count={16}
			opacity={0.1}
			accentOpacity={0.42}
			minSize={22}
			maxSize={88}
			minVelocity={0.1}
			maxVelocity={0.32}
			minRotationSpeed={0.06}
			maxRotationSpeed={0.35}
			strokeWidth={1.5}
			accentStrokeWidth={2.2}
			accentMinSpan={80}
			accentMaxSpan={170}
		/>

		<div class="content">
			<h1>임준상</h1>
			<p class="nickname">catea</p>
			<div class="intro">
				<p>공명을 업으로 삼고 싶습니다.</p>
				<p>제작자 임준상입니다.</p>
			</div>
		</div>

		<button class="scroll-hint" on:click={scrollToLinks} aria-label="아래로 스크롤">
			<span class="chevron-wrap" aria-hidden="true">
				<span class="chevron">›</span>
			</span>
		</button>
	</section>

	<ProfileLinks />
</div>

<style lang="scss">
	@import '../lib/scss/variable.scss';
	@import '../lib/scss/responsive.scss';

	.page {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.home {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		min-height: 100dvh;
		overflow: hidden;
		flex-shrink: 0;
	}

	.content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	h1 {
		font-size: 3rem;
		font-weight: 700;
		color: $black-color;
		letter-spacing: -0.02em;
		line-height: 1.2;
		margin: 0;
	}

	.nickname {
		margin: 6px 0 0;
		font-size: 0.85rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		color: rgba($black-color, 0.4);
	}

	.intro {
		margin-top: 28px;
		display: flex;
		flex-direction: column;
		gap: 6px;

		p {
			margin: 0;
			font-size: 1.05rem;
			font-weight: 500;
			color: rgba($black-color, 0.82);
			letter-spacing: -0.02em;
			line-height: 1.6;
		}
	}

	.scroll-hint {
		position: absolute;
		bottom: 28px;
		left: 50%;
		z-index: 2;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 52px;
		height: 52px;
		padding: 0;
		border: none;
		background: transparent;
		cursor: pointer;
		color: rgba($black-color, 0.5);
		transition: color 0.2s ease;

		&:hover {
			color: rgba($black-color, 0.75);
		}
	}

	.chevron-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		animation: hint-bob 1.8s ease-in-out infinite;
	}

	.chevron {
		display: block;
		font-size: 2.5rem;
		line-height: 1;
		font-weight: 500;
		transform: rotate(90deg);
	}

	@keyframes hint-bob {
		0%,
		100% {
			transform: translateY(-8px);
		}
		50% {
			transform: translateY(8px);
		}
	}

	@include mobile {
		h1 {
			font-size: 2.4rem;
		}

		.intro p {
			font-size: 0.95rem;
		}

		.scroll-hint {
			bottom: 20px;
		}
	}
</style>
