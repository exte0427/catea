<script lang="ts">
	interface HistoryEntry {
		event: string;
		result: string;
		context?: string;
		roles: string[];
	}

	interface HistoryYear {
		year: string;
		entries: HistoryEntry[];
	}

	const socialLinks = [
		{ name: 'pixiv', href: 'https://www.pixiv.net/users/89300680' },
		{ name: 'x', href: 'https://x.com/drawcatea' },
		{ name: 'github', href: 'https://github.com/exte0427' },
		{ name: 'youtube', href: 'https://www.youtube.com/@drawcatea' }
	];

	const contactItems = [
		{ label: '이메일', href: 'mailto:exmuh1@gmail.com', value: 'exmuh1@gmail.com' },
		{ label: '전화', href: 'tel:010-5944-4873', value: '010-5944-4873' }
	];

	const historyByYear: HistoryYear[] = [
		{
			year: '2022',
			entries: [
				{
					event: '제4회 한국코드페어 해커톤',
					result: '은상',
					context: 'localhost팀',
					roles: ['기획', '서버 프로그래밍']
				}
			]
		},
		{
			year: '2024',
			entries: [
				{
					event: '제 1회 성남시청소년게임개발대회',
					result: '대상',
					context: 'Epic Legends 팀',
					roles: ['기획', '아트', '프로그래밍']
				},
				{
					event: '경기 청소년 게임잼',
					result: '스토리상',
					context: '어벤져스 팀',
					roles: ['기획', '아트']
				},
				{
					event: 'AWS 흑백개발자 미슐랭',
					result: '1스타',
					roles: ['기획', '서버 개발']
				}
			]
		},
		{
			year: '2025',
			entries: [
				{
					event: 'betterground (2025)',
					result: '수료',
					context: 'Epic Legends',
					roles: ['기획', '아트']
				},
				{
					event: '제 15회 EICON 세계대회',
					result: '3위',
					context: '게임 Bloom',
					roles: ['기획', '서버 프로그래밍']
				}
			]
		},
		{
			year: '2026',
			entries: [
				{
					event: 'CKIC (2026)',
					result: '1위 · 인기상',
					context: '게임 DAMI',
					roles: ['기획', '프로그래밍', '아트']
				}
			]
		}
	];

	const summaryLine = (entry: HistoryEntry) =>
		entry.context ? `${entry.event} · ${entry.context}` : entry.event;
</script>

<section class="profile-links" id="links">
	<div class="inner">
		<div class="block">
			<p class="label">링크</p>
			<ul class="social-grid">
				{#each socialLinks as link}
					<li>
						<a href={link.href} target="_blank" rel="noopener noreferrer">{link.name}</a>
					</li>
				{/each}
			</ul>
		</div>

		<div class="block">
			<p class="label">연락처</p>
			<ul class="contact-list">
				{#each contactItems as item}
					<li>
						<span class="key">{item.label}</span>
						<a href={item.href}>{item.value}</a>
					</li>
				{/each}
			</ul>
		</div>

		<div class="block history-block" id="history">
			<p class="label">이력</p>

			<div class="timeline">
				{#each historyByYear as yearGroup}
					<section class="year-group">
						{#each yearGroup.entries as entry, index}
							<article class="milestone-row">
								<div class="year-col">
									{#if index === 0}
										<span class="year-marker">{yearGroup.year}</span>
									{/if}
								</div>

								<div class="rail" aria-hidden="true">
									<span class="rail-line"></span>
									<span class="rail-node"></span>
								</div>

								<div class="entry-col">
									<div class="entry-line">
										<span class="result-box">{entry.result}</span>
										<span class="summary">{summaryLine(entry)}</span>
									</div>
									<p class="roles-line">{entry.roles.join(' · ')}</p>
								</div>
							</article>
						{/each}
					</section>
				{/each}
			</div>
		</div>
	</div>

	<div class="waves" aria-hidden="true">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
			<defs>
				<path
					id="profile-wave"
					d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
				/>
			</defs>
			<g class="wave-layer">
				<use href="#profile-wave" x="48" y="0" fill="rgba(255,255,255,0.12)" stroke="#ffffff" stroke-width="0.35" />
				<use href="#profile-wave" x="48" y="3" fill="rgba(255,255,255,0.08)" stroke="#ffffff" stroke-width="0.35" />
				<use href="#profile-wave" x="48" y="7" fill="rgba(255,255,255,0.14)" stroke="#ffffff" stroke-width="0.35" />
			</g>
		</svg>
	</div>
</section>

<style lang="scss">
	@import '../scss/responsive.scss';

	.profile-links {
		position: relative;
		z-index: 1;
		padding: 80px 24px 100px;
		background-color: #37719e;
		color: #fff;
		overflow: hidden;
	}

	.inner {
		position: relative;
		z-index: 2;
		max-width: 560px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 56px;
	}

	.label {
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.55);
		margin-bottom: 20px;
	}

	.social-grid {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10px;
	}

	.social-grid a {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 14px 16px;
		border: 1.5px solid rgba(255, 255, 255, 0.38);
		color: #fff;
		font-size: 0.9rem;
		font-weight: 500;
		text-decoration: none;
		background: transparent;
		box-shadow: none;
		margin: 0;
		border-radius: 0;
		transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;

		&:hover {
			border-color: #fff;
			background-color: #fff;
			color: #37719e;
			transform: none;
			box-shadow: none;
		}
	}

	.contact-list {
		list-style: none;
		padding: 0;
		margin: 0;
		border-top: 1px solid rgba(255, 255, 255, 0.22);
	}

	.contact-list li {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
		padding: 16px 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.22);
	}

	.key {
		flex-shrink: 0;
		font-size: 0.78rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		color: rgba(255, 255, 255, 0.55);
		min-width: 48px;
	}

	.contact-list a {
		font-size: 0.92rem;
		font-weight: 500;
		color: #fff;
		text-decoration: none;
		text-align: right;
		word-break: break-all;
		background: transparent;
		padding: 0;
		margin: 0;
		box-shadow: none;
		border-radius: 0;
		transition: opacity 0.2s ease;

		&:hover {
			opacity: 0.65;
			transform: none;
			box-shadow: none;
			background: transparent;
			color: #fff;
		}
	}

	.history-block {
		padding-top: 8px;
		border-top: 1px solid rgba(255, 255, 255, 0.22);
	}

	.timeline {
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.year-group {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.milestone-row {
		display: grid;
		grid-template-columns: 44px 36px 1fr;
		column-gap: 10px;
		align-items: start;
	}

	.year-col {
		display: flex;
		justify-content: center;
		padding-top: 2px;
		min-height: 28px;
	}

	.year-marker {
		font-size: 0.82rem;
		font-weight: 700;
		color: #fff;
		letter-spacing: -0.02em;
		line-height: 1;
		padding: 6px 4px;
		border: 1px solid rgba(255, 255, 255, 0.55);
		background: rgba(255, 255, 255, 0.08);
		min-width: 40px;
		text-align: center;
	}

	.rail {
		position: relative;
		height: 28px;
		display: flex;
		align-items: center;
	}

	.rail-line {
		width: 100%;
		height: 1px;
		background: rgba(255, 255, 255, 0.38);
	}

	.rail-node {
		position: absolute;
		right: -1px;
		width: 7px;
		height: 7px;
		border: 1px solid #fff;
		background: #37719e;
		flex-shrink: 0;
	}

	.entry-col {
		min-width: 0;
		padding-bottom: 2px;
	}

	.entry-line {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		flex-wrap: wrap;
	}

	.result-box {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 52px;
		padding: 5px 8px;
		font-size: 0.72rem;
		font-weight: 700;
		line-height: 1.2;
		color: #37719e;
		background: #fff;
		border: 1px solid #fff;
		text-align: center;
	}

	.summary {
		flex: 1;
		min-width: 0;
		font-size: 0.9rem;
		font-weight: 500;
		line-height: 1.55;
		color: rgba(255, 255, 255, 0.94);
		letter-spacing: -0.02em;
		padding-top: 3px;
	}

	.roles-line {
		margin: 8px 0 0;
		padding-left: 62px;
		font-size: 0.78rem;
		font-weight: 500;
		line-height: 1.5;
		color: rgba(255, 255, 255, 0.58);
		letter-spacing: -0.01em;
	}

	.waves {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 72px;
		pointer-events: none;
		z-index: 1;
		opacity: 0.55;
	}

	.waves svg {
		width: 100%;
		height: 100%;
		display: block;
	}

	.wave-layer > use {
		animation: wave-flow 22s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
	}

	.wave-layer > use:nth-child(1) {
		animation-delay: -2s;
		animation-duration: 9s;
	}

	.wave-layer > use:nth-child(2) {
		animation-delay: -4s;
		animation-duration: 14s;
	}

	.wave-layer > use:nth-child(3) {
		animation-delay: -6s;
		animation-duration: 20s;
	}

	@keyframes wave-flow {
		0% {
			transform: translate3d(-90px, 0, 0);
		}
		100% {
			transform: translate3d(85px, 0, 0);
		}
	}

	@include desktop {
		.social-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@include mobile {
		.profile-links {
			padding: 64px 20px 88px;
		}

		.inner {
			gap: 44px;
		}

		.waves {
			height: 56px;
		}

		.milestone-row {
			grid-template-columns: 40px 28px 1fr;
			column-gap: 8px;
		}

		.roles-line {
			padding-left: 0;
		}
	}
</style>
