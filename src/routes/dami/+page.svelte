<script lang="ts">
	import damiLogo from '$lib/images/dami_white.png?url';
	import shot1 from '$lib/images/1.png?url';
	import shot2 from '$lib/images/2.png?url';
	import shot3 from '$lib/images/3.png?url';

	const demoDriveUrl =
		'https://drive.google.com/drive/folders/1m8DjJFu5g8Uu_xjtAkDu4qLTzEwh5YCr?usp=sharing';

	const links = [
		{
			name: 'STEAM',
			href: '#',
			desc: 'Steam 페이지에서 DAMI를 만나보세요',
			disabled: true
		},
		{
			name: 'BIC',
			href: '#',
			desc: '부산 인디커넥트 페스티벌 관련 페이지',
			disabled: true
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
			tag: '#일촉즉발',
			body: '모든 대상은 두 번 타격당하면 끝입니다. 유예는 없습니다. 제한된 행동력 속, 모든 선택이 치명적으로 작용하는 일촉즉발의 상황에서 나아갈 수 있을까요.'
		},
		{
			tag: '#포스트아포칼립스',
			body: '식어버린 세상, 무너져내린 문명, 더이상 인간은 세상의 주인이 아닌가봅니다. 빛과 온기로 동물을 유혹해 포자를 퍼트리는 동충하초, 사나움을 무기로 적응해나간 동물들. 7월이지만 매미소리는 들리지 않는, 그런 세상에서의 일상을 담습니다.'
		},
		{
			tag: '#희망',
			body: '물자를 수집하고, 충분한 휴식을 취하세요. 뛰어난 조력자를 만나는 일도, 굉장한 은신처의 정보를 입수하는 일도 없지만 절망적인 하루하루가 내일을 살아낼 희망이 되는 날이 올겁니다.'
		}
	];

	const lead = {
		question: '기형화된 생태계의 식어버린 포스트아포칼립스의 세상에서 희망은 있을까요?',
		answer: '일촉즉발, 과감한 액션의 탑뷰 어드벤처 게임 다미입니다.'
	};

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
	let dragStartX: number | null = null;
	let dragDelta = 0;
	let dragging = false;

	const wrap = (index: number) => {
		const len = mediaItems.length;
		return ((index % len) + len) % len;
	};

	$: prevIndex = wrap(active - 1);
	$: nextIndex = wrap(active + 1);
	$: activeItem = mediaItems[active];

	const goPrev = () => {
		active = wrap(active - 1);
	};

	const goNext = () => {
		active = wrap(active + 1);
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

<div class="dami-page">
	<section class="illustration">
		<img class="hero-logo" src={damiLogo} alt="DAMI" />
		<a
			class="demo-btn"
			href={demoDriveUrl}
			target="_blank"
			rel="noopener noreferrer"
		>
			데모/플레이 풀 영상 받기
		</a>
	</section>

	<div class="content">
		<section class="block trailer-block">
			<div
				class="trailer-viewport"
				aria-label="DAMI 미디어 갤러리"
				on:pointerdown={onPointerDown}
				on:pointermove={onPointerMove}
				on:pointerup={onPointerUp}
				on:pointercancel={onPointerUp}
				style="--drag: {dragging ? dragDelta : 0}px"
				role="region"
			>
				<div class="trailer-stage" class:dragging>
					<button class="slide" type="button" on:click={goPrev} aria-label="이전">
						<img src={mediaItems[prevIndex].thumb} alt="" draggable="false" />
					</button>

					<div class="slide slide-active" role="group" aria-roledescription="slide" aria-label={activeItem.label}>
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

					<button class="slide" type="button" on:click={goNext} aria-label="다음">
						<img src={mediaItems[nextIndex].thumb} alt="" draggable="false" />
					</button>
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
							aria-selected={i === active}
							on:click={() => (active = i)}
						></button>
					{/each}
				</div>
				<button type="button" class="nav-btn" on:click={goNext} aria-label="다음">›</button>
			</div>
		</section>

		<section class="block tags-block">
			<div class="lead">
				<p class="lead-q">{lead.question}</p>
				<p class="lead-a">{lead.answer}</p>
			</div>

			{#each tags as item}
				<article class="tag-item">
					<h2>{item.tag}</h2>
					<p>{item.body}</p>
				</article>
			{/each}
		</section>

		<section class="block links-block">
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

		<section class="block specs-block">
			<p class="section-label">최소 사양</p>
			<ul class="specs">
				<li>
					<span class="spec-key">OS</span>
					<span class="spec-val">Windows 10 64비트 (21H1+)</span>
				</li>
				<li>
					<span class="spec-key">CPU</span>
					<span class="spec-val">x64 듀얼코어 (SSE2)</span>
				</li>
				<li>
					<span class="spec-key">RAM</span>
					<span class="spec-val">8GB</span>
				</li>
				<li>
					<span class="spec-key">GPU</span>
					<span class="spec-val">DirectX 11 (GTX 750 / 동급 이상)</span>
				</li>
				<li>
					<span class="spec-key">저장공간</span>
					<span class="spec-val">여유 공간 1GB 이상</span>
				</li>
			</ul>
		</section>

		<section class="block exhibit-block">
			<p class="section-label">전시</p>
			<div class="exhibit">
				<span class="exhibit-year">2026</span>
				<div class="exhibit-body">
					<strong>BIC 루키 전시</strong>
					<p>부산 인디커넥트 페스티벌 Rookie 전시 참가</p>
				</div>
			</div>
		</section>
	</div>
</div>

<style lang="scss">
	@import '../../lib/scss/variable.scss';
	@import '../../lib/scss/responsive.scss';

	.dami-page {
		width: 100%;
		padding-bottom: 96px;
	}

	.illustration {
		width: 100%;
		max-width: 960px;
		margin: 0 auto;
		min-height: 280px;
		padding: 56px 24px 48px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 28px;
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

	.demo-btn {
		display: inline-flex !important;
		align-items: center;
		justify-content: center;
		padding: 12px 22px !important;
		margin: 0 !important;
		border: 1.5px solid rgba(255, 255, 255, 0.55) !important;
		border-radius: 999px !important;
		background: transparent !important;
		color: #f5f5f5 !important;
		font-family: inherit;
		font-size: 0.92rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		text-decoration: none !important;
		line-height: 1.2;
		transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;

		&:hover {
			background: rgba(255, 255, 255, 0.1) !important;
			border-color: rgba(255, 255, 255, 0.85) !important;
			color: #fff !important;
		}
	}

	.content {
		max-width: 960px;
		margin: 0 auto;
		padding: 40px 24px 0;
	}

	.section-label {
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba($black-color, 0.4);
		margin: 0 0 18px;
	}

	.block {
		margin-bottom: 56px;
	}

	.trailer-block {
		max-width: none;
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

	.trailer-stage {
		display: flex;
		align-items: stretch;
		justify-content: center;
		gap: 12px;
		width: 100%;
		transform: translateX(var(--drag, 0px));
		transition: transform 0.25s ease;

		&.dragging {
			transition: none;
		}
	}

	.slide {
		flex: 0 0 100%;
		width: 100%;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		border: 1.5px solid rgba($black-color, 0.18);
		background: #1a1512;
		padding: 0;
		margin: 0;
		font-family: inherit;
		cursor: pointer;
		pointer-events: none;
		position: relative;
	}

	.slide-active {
		cursor: default;
	}

	.slide img,
	.slide iframe {
		display: block !important;
		width: 100% !important;
		max-width: none !important;
		height: 100% !important;
		margin: 0 !important;
		padding: 0 !important;
		border: 0 !important;
		border-radius: 0 !important;
		object-fit: contain;
		background: #1a1512;
		pointer-events: none;
		box-shadow: none !important;
	}

	.slide-active iframe {
		pointer-events: auto;
		position: absolute;
		inset: 0;
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
		border: 1.5px solid rgba($black-color, 0.22);
		background: transparent;
		color: $black-color;
		font-size: 1.4rem;
		line-height: 1;
		cursor: pointer;
		font-family: inherit;
		transition: background-color 0.2s ease, color 0.2s ease;

		&:hover {
			background: $black-color;
			color: $white-color;
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
		border: 1px solid rgba($black-color, 0.35);
		background: transparent;
		cursor: pointer;
		border-radius: 0;

		&.active {
			background: $black-color;
			border-color: $black-color;
		}
	}

	.tags-block {
		display: flex;
		flex-direction: column;
		gap: 48px;
	}

	.lead {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding-bottom: 8px;
	}

	.lead-q {
		margin: 0;
		font-size: 1.15rem;
		font-weight: 700;
		line-height: 1.7;
		color: $black-color;
		letter-spacing: -0.02em;
	}

	.lead-a {
		margin: 0;
		font-size: 1rem;
		font-weight: 500;
		line-height: 1.7;
		color: rgba($black-color, 0.72);
		letter-spacing: -0.02em;
	}

	.tag-item {
		h2 {
			margin: 0 0 16px;
			font-size: clamp(2.4rem, 8vw, 4.5rem);
			font-weight: 700;
			color: $black-color;
			letter-spacing: -0.04em;
			line-height: 1.05;
		}

		p {
			margin: 0;
			font-size: 1rem;
			font-weight: 500;
			line-height: 1.8;
			color: rgba($black-color, 0.78);
			letter-spacing: -0.02em;
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
		justify-content: center;
		gap: 8px;
		width: 100% !important;
		padding: 22px 24px !important;
		margin: 0 !important;
		border: 1.5px solid rgba($black-color, 0.22) !important;
		border-radius: 0 !important;
		color: $black-color !important;
		text-decoration: none;
		text-align: left !important;
		background: transparent !important;
		box-shadow: none !important;
		font-size: inherit !important;
		font-weight: inherit !important;
		transform: none !important;
		transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;

		&:hover {
			border-color: $black-color !important;
			background-color: $black-color !important;
			color: #fff !important;
			transform: none !important;
			box-shadow: none !important;

			.link-name,
			.link-desc {
				color: #fff !important;
			}

			.link-desc {
				opacity: 0.75;
			}
		}
	}

	.link-card--disabled {
		opacity: 0.38;
		filter: grayscale(0.35);
		cursor: not-allowed;
		pointer-events: none;
		user-select: none;

		&:hover {
			border-color: rgba($black-color, 0.22) !important;
			background: transparent !important;
			color: $black-color !important;

			.link-name {
				color: $black-color !important;
			}

			.link-desc {
				color: rgba($black-color, 0.55) !important;
				opacity: 1;
			}
		}
	}

	.link-name {
		font-size: 1.2rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		color: $black-color !important;
	}

	.link-desc {
		font-size: 0.88rem;
		font-weight: 500;
		line-height: 1.5;
		color: rgba($black-color, 0.55) !important;
		transition: color 0.2s ease, opacity 0.2s ease;
	}

	.specs {
		list-style: none;
		padding: 0;
		margin: 0;
		border-top: 1px solid rgba($black-color, 0.12);
	}

	.specs li {
		display: grid;
		grid-template-columns: 88px 1fr;
		gap: 16px;
		align-items: baseline;
		padding: 16px 0;
		border-bottom: 1px solid rgba($black-color, 0.12);
	}

	.spec-key {
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: rgba($black-color, 0.45);
	}

	.spec-val {
		font-size: 0.95rem;
		font-weight: 500;
		line-height: 1.5;
		color: rgba($black-color, 0.85);
		letter-spacing: -0.02em;
	}

	.exhibit {
		display: flex;
		align-items: flex-start;
		gap: 18px;
		padding: 22px 24px;
		border: 1.5px solid rgba($black-color, 0.22);
	}

	.exhibit-year {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 56px;
		padding: 8px 10px;
		font-size: 0.85rem;
		font-weight: 700;
		color: #fff;
		background: $black-color;
		letter-spacing: -0.02em;
	}

	.exhibit-body {
		strong {
			display: block;
			margin: 0 0 6px;
			font-size: 1.1rem;
			font-weight: 700;
			color: $black-color;
			letter-spacing: -0.02em;
			background: transparent;
		}

		p {
			margin: 0;
			font-size: 0.88rem;
			font-weight: 500;
			line-height: 1.55;
			color: rgba($black-color, 0.55);
		}
	}

	@include mobile {
		.dami-page {
			padding-bottom: 72px;
		}

		.content {
			padding: 36px 20px 0;
		}

		.block {
			margin-bottom: 44px;
		}

		.tags-block {
			gap: 36px;
		}

		.illustration {
			max-width: 100%;
			min-height: 240px;
			padding: 44px 20px 40px;
			gap: 22px;
		}

		.hero-logo {
			width: min(220px, 62vw) !important;
		}

		.demo-btn {
			font-size: 0.86rem;
			padding: 11px 18px !important;
		}

		.slide {
			flex-basis: 100%;
			width: 100%;
		}

		.trailer-stage {
			gap: 8px;
		}

		.link-card {
			padding: 18px 18px !important;
		}

		.link-name {
			font-size: 1.1rem;
		}

		.specs li {
			grid-template-columns: 72px 1fr;
			gap: 12px;
		}

		.exhibit {
			padding: 18px;
		}
	}
</style>
