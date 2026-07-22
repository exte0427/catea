<script lang="ts">
	export let label = '불러오는 중…';
	export let progress: number | null = null;
</script>

<div class="loading" aria-busy="true" aria-live="polite">
	<div class="track">
		{#if progress === null}
			<div class="bar bar--indeterminate"></div>
		{:else}
			<div class="bar bar--determinate" style="width: {Math.max(4, Math.min(100, progress))}%"></div>
		{/if}
	</div>
	<p>{label}{progress !== null ? ` ${Math.round(progress)}%` : ''}</p>
</div>

<style lang="scss">
	.loading {
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: 100%;
		padding: 8px 0;
	}

	.track {
		position: relative;
		width: 100%;
		height: 4px;
		overflow: hidden;
		background: rgba(0, 0, 0, 0.1);
	}

	.bar {
		position: absolute;
		inset: 0 auto 0 0;
		height: 100%;
		background: #141414;
	}

	.bar--indeterminate {
		width: 40%;
		animation: slide 1.1s ease-in-out infinite;
	}

	.bar--determinate {
		transition: width 0.25s ease;
	}

	p {
		margin: 0;
		font-size: 0.88rem;
		color: rgba(0, 0, 0, 0.55);
	}

	@keyframes slide {
		0% {
			transform: translateX(-120%);
		}
		100% {
			transform: translateX(320%);
		}
	}
</style>
