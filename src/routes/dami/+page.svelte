<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import shot1 from '$lib/images/1.png?url';
	import shot2 from '$lib/images/2.png?url';
	import shot3 from '$lib/images/3.png?url';

	const bicUrl = 'https://bicfest.org/exhibition/view/2030?chk=0&param=0';

	const links = [
		{
			name: 'STEAM',
			href: '#',
			desc: 'Steam 페이지에서 DAMI를 만나보세요',
			disabled: true
		},
		{
			name: 'BIC',
			href: bicUrl,
			desc: '부산 인디커넥트 페스티벌 전시 페이지',
			disabled: false
		},
		{
			name: 'Discord',
			href: 'https://discord.gg/gGwnS2P6ww',
			desc: 'DAMI 커뮤니티와 소식을 확인하세요',
			disabled: false
		}
	];

	const tags = [
		{
			tag: '# 일촉즉발',
			html: '모든 대상은 <strong class="u">두 번 타격당하면 끝입니다</strong>. 유예는 없습니다. 제한된 행동력 속, 모든 선택이 치명적으로 작용하는 <strong>일촉즉발의 상황</strong>에서 나아갈 수 있을까요'
		},
		{
			tag: '# 포스트 아포칼립스',
			html: '<strong>식어버린 세상, 무너져내린 문명,</strong> 더이상 인간은 세상의 주인이 아닌가봅니다. 빛과 온기로 동물을 유혹해 포자를 퍼트리는 동충하초, 사나움을 무기로 적응해나간 동물들. 7월이지만 매미소리는 들리지 않는, 그런 세상에서의 일상을 담습니다'
		},
		{
			tag: '# 희망',
			html: '물자를 수집하고, 충분한 휴식을 취하세요. 뛰어난 조력자를 만나는 일도, 굉장한 은신처의 정보를 입수하는 일도 없지만 절망적인 하루하루가 내일을 살아낼 희망이 되는 날이 올겁니다'
		}
	];

	const youtubeId = 'v4p2WAl8GWI';
	const mediaItems = [
		{
			id: 'trailer',
			label: '트레일러',
			type: 'video' as const,
			src: `https://www.youtube.com/embed/${youtubeId}`,
			thumb: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
		},
		{ id: 'shot1', label: '스크린샷 1', type: 'image' as const, src: shot1, thumb: shot1 },
		{ id: 'shot2', label: '스크린샷 2', type: 'image' as const, src: shot2, thumb: shot2 },
		{ id: 'shot3', label: '스크린샷 3', type: 'image' as const, src: shot3, thumb: shot3 }
	];

	let active = 0;
	let dir = 1;
	let dragStartX: number | null = null;
	let dragDelta = 0;
	let dragging = false;

	const wrap = (index: number) => {
		const len = mediaItems.length;
		return ((index % len) + len) % len;
	};

	$: activeItem = mediaItems[active];

	const goPrev = () => {
		dir = -1;
		active = wrap(active - 1);
	};

	const goNext = () => {
		dir = 1;
		active = wrap(active + 1);
	};

	const goTo = (index: number) => {
		if (index === active) return;
		const len = mediaItems.length;
		if (active === len - 1 && index === 0) dir = 1;
		else if (active === 0 && index === len - 1) dir = -1;
		else dir = index > active ? 1 : -1;
		active = index;
	};

	const onPointerDown = (event: PointerEvent) => {
		dragging = true;
		dragStartX = event.clientX;
		dragDelta = 0;
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	};

	const onPointerMove = (event: PointerEvent) => {
		if (!dragging || dragStartX === null) return;
		dragDelta = event.clientX - dragStartX;
	};

	const onPointerUp = (event: PointerEvent) => {
		if (!dragging) return;
		dragging = false;
		(event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
		const threshold = 48;
		if (dragDelta > threshold) goPrev();
		else if (dragDelta < -threshold) goNext();
		dragStartX = null;
		dragDelta = 0;
	};
</script>

<svelte:head>
	<title>DAMI · catea</title>
	<meta name="description" content="DAMI — 임준상이 개발 중인 게임" />
</svelte:head>

<div class="content">
	<section class="block trailer-block">
		<div
			class="trailer-viewport"
			aria-label="DAMI 미디어 갤러리"
			on:pointerdown={onPointerDown}
			on:pointermove={onPointerMove}
			on:pointerup={onPointerUp}
			on:pointercancel={onPointerUp}
			role="region"
		>
			<div class="slide-frame">
				{#key active}
					<div
						class="slide-media"
						in:fly={{ x: dir * 56, duration: 480, opacity: 0, easing: cubicOut }}
						out:fly={{ x: dir * -56, duration: 360, opacity: 0, easing: cubicOut }}
					>
						{#if activeItem.type === 'video'}
							<iframe
								src="{activeItem.src}?rel=0"
								title={activeItem.label}
								frameborder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowfullscreen
							></iframe>
						{:else}
							<img src={activeItem.src} alt={activeItem.label} draggable="false" />
						{/if}
					</div>
				{/key}
			</div>
		</div>

		<div class="trailer-controls">
			<button type="button" class="nav-btn" on:click={goPrev} aria-label="이전">‹</button>
			<div class="dots" role="tablist" aria-label="미디어 선택">
				{#each mediaItems as item, i}
					<button
						type="button"
						class="dot"
						class:active={i === active}
						aria-label="{item.label} 보기"
						on:click={() => goTo(i)}
					></button>
				{/each}
			</div>
			<button type="button" class="nav-btn" on:click={goNext} aria-label="다음">›</button>
		</div>
	</section>

	<section class="block tags-block">
		{#each tags as item}
			<article class="tag-item">
				<h2>{item.tag}</h2>
				<p>{@html item.html}</p>
			</article>
		{/each}
	</section>

	<section class="block">
		<p class="section-label">관련 링크</p>
		<ul class="links">
			{#each links as link}
				<li>
					{#if link.disabled}
						<div class="link-card link-card--disabled" aria-disabled="true">
							<span class="link-name">{link.name}</span>
							<span class="link-desc">{link.desc}</span>
						</div>
					{:else}
						<a href={link.href} target="_blank" rel="noopener noreferrer" class="link-card">
							<span class="link-name">{link.name}</span>
							<span class="link-desc">{link.desc}</span>
						</a>
					{/if}
				</li>
			{/each}
		</ul>
	</section>

	<section class="block">
		<p class="section-label">최소 사양</p>
		<ul class="specs">
			<li><span class="spec-key">OS</span><span class="spec-val">Windows 10 64비트 (21H1+)</span></li>
			<li><span class="spec-key">CPU</span><span class="spec-val">x64 듀얼코어 (SSE2)</span></li>
			<li><span class="spec-key">RAM</span><span class="spec-val">8GB</span></li>
			<li><span class="spec-key">GPU</span><span class="spec-val">DirectX 11 (GTX 750 / 동급 이상)</span></li>
			<li><span class="spec-key">저장공간</span><span class="spec-val">여유 공간 1GB 이상</span></li>
		</ul>
	</section>

	<section class="block">
		<p class="section-label">전시</p>
		<a class="exhibit" href={bicUrl} target="_blank" rel="noopener noreferrer">
			<span class="exhibit-year">2026</span>
			<div class="exhibit-body">
				<strong>BIC 루키 전시</strong>
				<p>부산 인디커넥트 페스티벌 Rookie 전시 참가</p>
			</div>
		</a>
	</section>
</div>

<style lang="scss">
	@import '../../lib/scss/dami.scss';
	@import '../../lib/scss/responsive.scss';

	.content {
		max-width: 860px;
		margin: 0 auto;
		padding: 24px 24px 0;
		color: $dami-text;
	}

	.section-label {
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: $dami-faint;
		margin: 0 0 18px;
	}

	.block {
		margin-bottom: 72px;
	}

	.trailer-viewport {
		overflow: hidden;
		width: 100%;
		touch-action: pan-y;
		cursor: grab;
		user-select: none;

		&:active {
			cursor: grabbing;
		}
	}

	.slide-frame {
		position: relative;
		display: grid;
		width: 100%;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		border: 1px solid $dami-line;
		background: #0e0c0b;
	}

	.slide-media {
		grid-area: 1 / 1;
		width: 100%;
		height: 100%;
		min-height: 0;
	}

	.slide-media img,
	.slide-media iframe {
		display: block !important;
		width: 100% !important;
		max-width: none !important;
		height: 100% !important;
		margin: 0 !important;
		padding: 0 !important;
		border: 0 !important;
		border-radius: 0 !important;
		object-fit: contain;
		background: #0e0c0b;
		box-shadow: none !important;
	}

	.slide-media iframe {
		pointer-events: auto;
	}

	.trailer-controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		margin-top: 16px;
	}

	.nav-btn {
		width: 36px;
		height: 36px;
		border: 0;
		outline: none;
		background: transparent;
		color: $dami-text;
		font-size: 1.4rem;
		line-height: 1;
		cursor: pointer;
		font-family: inherit;

		&:hover,
		&:focus-visible {
			background: $dami-text;
			color: $dami-bg;
		}
	}

	.dots {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.dot {
		width: 8px;
		height: 8px;
		padding: 0;
		border: 1px solid $dami-muted;
		background: transparent;
		cursor: pointer;

		&.active {
			background: $dami-accent;
			border-color: $dami-accent;
		}
	}

	.tags-block {
		display: flex;
		flex-direction: column;
		gap: 48px;
		padding: 8px 0 4px;
	}

	.tag-item {
		h2 {
			margin: 0 0 12px;
			font-family: 'PartialSansKR', 'GMarketSans', sans-serif;
			font-size: clamp(1.35rem, 3.2vw, 1.85rem);
			font-weight: 400;
			color: $dami-text;
			letter-spacing: -0.03em;
			line-height: 1.05;
		}

		p {
			margin: 0;
			max-width: 640px;
			font-size: 1.02rem;
			font-weight: 500;
			line-height: 1.9;
			letter-spacing: -0.02em;
			color: rgba(244, 240, 234, 0.88);
		}

		:global(strong) {
			background: transparent;
			color: $dami-accent-bright;
			font-weight: 700;
		}

		:global(strong.u) {
			text-decoration: underline;
			text-underline-offset: 4px;
			text-decoration-thickness: 1px;
		}
	}

	.links {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.link-card {
		display: flex !important;
		flex-direction: column;
		align-items: flex-start !important;
		gap: 8px;
		width: 100% !important;
		padding: 22px 24px !important;
		margin: 0 !important;
		border: 1px solid $dami-line !important;
		border-radius: 0 !important;
		color: $dami-text !important;
		text-decoration: none;
		background: transparent !important;
		box-shadow: none !important;

		&:hover {
			border-color: $dami-accent !important;
			background-color: $dami-text !important;
			color: $dami-bg !important;
			transform: none !important;

			.link-name,
			.link-desc {
				color: $dami-bg !important;
			}
		}
	}

	.link-card--disabled {
		opacity: 0.38;
		pointer-events: none;
	}

	.link-name {
		font-size: 1.2rem;
		font-weight: 700;
		color: $dami-text !important;
	}

	.link-desc {
		font-size: 0.88rem;
		font-weight: 500;
		color: $dami-muted !important;
	}

	.specs {
		list-style: none;
		padding: 0;
		margin: 0;
		border-top: 1px solid $dami-line;
	}

	.specs li {
		display: grid;
		grid-template-columns: 88px 1fr;
		gap: 16px;
		padding: 16px 0;
		border-bottom: 1px solid $dami-line;
	}

	.spec-key {
		font-size: 0.78rem;
		font-weight: 700;
		color: $dami-faint;
	}

	.spec-val {
		font-size: 0.95rem;
		font-weight: 500;
		color: $dami-text;
	}

	.exhibit {
		display: flex !important;
		align-items: flex-start !important;
		gap: 18px;
		padding: 22px 24px !important;
		margin: 0 !important;
		border: 1px solid $dami-line !important;
		border-radius: 0 !important;
		background: transparent !important;
		box-shadow: none !important;
		text-decoration: none !important;
		text-align: left !important;
		color: $dami-text !important;
		transform: none !important;

		&:hover {
			border-color: $dami-accent !important;
			background: rgba(244, 240, 234, 0.04) !important;
			transform: none !important;
			box-shadow: none !important;
		}
	}

	.exhibit-year {
		flex: 0 0 auto;
		align-self: flex-start;
		min-width: 56px;
		height: fit-content;
		padding: 8px 10px;
		font-size: 0.85rem;
		font-weight: 700;
		color: $dami-bg;
		background: $dami-accent;
		text-align: center;
		line-height: 1.2;
	}

	.exhibit-body {
		strong {
			display: block;
			margin: 0 0 6px;
			font-size: 1.1rem;
			font-weight: 700;
			background: transparent;
			color: $dami-text;
		}

		p {
			margin: 0;
			font-size: 0.88rem;
			color: $dami-muted;
		}
	}

	@include mobile {
		.content {
			padding: 12px 20px 0;
		}

		.block {
			margin-bottom: 52px;
		}

		.tags-block {
			gap: 56px;
			padding-top: 8px;
		}
	}
</style>
