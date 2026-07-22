<script lang="ts">
	import { tick } from 'svelte';
	import FloatingShapes from '$lib/sources/FloatingShapes.svelte';
	import html2canvas from 'html2canvas';
	import { jsPDF } from 'jspdf';

	const SITE = 'https://catea.netlify.app';

	let name = '임준상';
	let tagline = 'saturation catea';
	let role = '게임 개발자';
	let website = SITE;
	let email = 'exmuh1@gmail.com';
	let phone = '010-5944-4873';

	let nameSize = 1.7;
	let taglineSize = 0.88;
	let metaSize = 0.68;

	let gapNameTagline = 6;
	let gapTaglineRole = 10;
	let gapRoleItems = 0.45;
	let gapContacts = 0.9;
	let gapIconText = 0.28;
	let padX = 9;
	let padY = 8;

	let count = 16;
	let speed = 0.7;
	let opacity = 0.1;
	let accentOpacity = 0.42;
	let minSize = 18;
	let maxSize = 64;
	let strokeWidth = 1.4;
	let accentStrokeWidth = 2;
	let edgeOverflow = 1.5;
	let shapeKey = 0;
	let exporting = false;
	let exportMsg = '';
	let flipped = false;

	let frontEl: HTMLElement;
	let backEl: HTMLElement;

	const rand = (min: number, max: number) => min + Math.random() * (max - min);
	const randInt = (min: number, max: number) => Math.round(rand(min, max));

	const randomizeShapes = async () => {
		count = randInt(10, 22);
		speed = Number(rand(0.35, 1.1).toFixed(2));
		opacity = Number(rand(0.06, 0.16).toFixed(2));
		accentOpacity = Number(rand(0.28, 0.55).toFixed(2));
		minSize = randInt(14, 26);
		maxSize = randInt(48, 78);
		strokeWidth = Number(rand(1.1, 1.8).toFixed(1));
		accentStrokeWidth = Number(rand(1.6, 2.6).toFixed(1));
		edgeOverflow = Number(rand(1.1, 1.5).toFixed(2));
		shapeKey += 1;
		await tick();
	};

	const capture = async (el: HTMLElement) => {
		const canvas = await html2canvas(el, {
			backgroundColor: null,
			scale: 4,
			useCORS: true,
			logging: false,
			width: el.offsetWidth,
			height: el.offsetHeight
		});
		return canvas;
	};

	const downloadCanvas = (canvas: HTMLCanvasElement, filename: string) => {
		const a = document.createElement('a');
		a.href = canvas.toDataURL('image/png');
		a.download = filename;
		a.click();
	};

	const withBothSides = async (run: (front: HTMLCanvasElement, back: HTMLCanvasElement) => Promise<void>) => {
		if (exporting) return;
		exporting = true;
		const wasFlipped = flipped;
		flipped = false;
		await tick();
		await new Promise((r) => setTimeout(r, 120));

		try {
			const frontCanvas = await capture(frontEl);
			flipped = true;
			await tick();
			await new Promise((r) => setTimeout(r, 80));
			const backCanvas = await capture(backEl);
			await run(frontCanvas, backCanvas);
		} catch (err) {
			console.error(err);
			exportMsg = '저장에 실패했습니다.';
		} finally {
			flipped = wasFlipped;
			exporting = false;
		}
	};

	const exportPdf = async () => {
		exportMsg = '고화질 PDF 생성 중…';
		await withBothSides(async (frontCanvas, backCanvas) => {
			const pdf = new jsPDF({
				orientation: 'landscape',
				unit: 'mm',
				format: [90, 50],
				compress: true
			});

			const w = 90;
			const h = 50;
			pdf.addImage(frontCanvas.toDataURL('image/png'), 'PNG', 0, 0, w, h, undefined, 'FAST');
			pdf.addPage([90, 50], 'landscape');
			pdf.addImage(backCanvas.toDataURL('image/png'), 'PNG', 0, 0, w, h, undefined, 'FAST');
			pdf.save('catea-business-card.pdf');
			exportMsg = 'PDF를 저장했습니다. (90×50mm, 고해상도)';
		});
	};

	const exportPng = async () => {
		exportMsg = '고화질 PNG 생성 중…';
		await withBothSides(async (frontCanvas, backCanvas) => {
			downloadCanvas(frontCanvas, 'catea-business-card-front.png');
			await new Promise((r) => setTimeout(r, 80));
			downloadCanvas(backCanvas, 'catea-business-card-back.png');
			exportMsg = 'PNG 앞·뒷면을 저장했습니다. (고해상도)';
		});
	};
</script>

<section class="card-maker">
	<p class="label">임시 · 명함</p>
	<h2>명함 메이커</h2>
	<p class="lead">메인 도형 무드를 커스터마이즈한 뒤 랜덤 생성하고, 고화질 PDF·PNG로 출력할 수 있습니다.</p>

	<div class="layout">
		<div class="preview-wrap">
			<div class="stage" class:flipped>
				<div class="card front" bind:this={frontEl}>
					{#key shapeKey}
						<FloatingShapes
							{speed}
							{count}
							{opacity}
							{accentOpacity}
							{minSize}
							{maxSize}
							{strokeWidth}
							{accentStrokeWidth}
							{edgeOverflow}
							minVelocity={0.08}
							maxVelocity={0.28}
							minRotationSpeed={0.05}
							maxRotationSpeed={0.32}
							accentMinSpan={80}
							accentMaxSpan={170}
							strokeColor="#57514a"
						/>
					{/key}
					<div
						class="front-copy"
						style="
							--name-size: {nameSize}rem;
							--tagline-size: {taglineSize}rem;
							--meta-size: {metaSize}rem;
							--gap-name-tagline: {gapNameTagline}px;
							--gap-tagline-role: {gapTaglineRole}px;
							--gap-role-items: {gapRoleItems}em;
							--gap-contacts: {gapContacts}em;
							--gap-icon-text: {gapIconText}em;
							--pad-x: {padX}%;
							--pad-y: {padY}%;
						"
					>
						<div class="front-main">
							<p class="name">{name}</p>
							<p class="tagline">{tagline}</p>
							<p class="role-line">
								<span class="role">
									<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">
										<path
											d="M8.5 9.5h7v5h-7z"
											fill="none"
											stroke="currentColor"
											stroke-width="1.7"
											stroke-linejoin="round"
										/>
										<path
											d="M6 11.2H4.2a1.2 1.2 0 0 0 0 2.4H6M18 11.2h1.8a1.2 1.2 0 0 1 0 2.4H18"
											fill="none"
											stroke="currentColor"
											stroke-width="1.7"
											stroke-linecap="round"
										/>
										<path
											d="M9.2 7.6V6.3M14.8 7.6V6.3M9.2 16.4v1.3M14.8 16.4v1.3"
											fill="none"
											stroke="currentColor"
											stroke-width="1.7"
											stroke-linecap="round"
										/>
										<circle cx="10.2" cy="12" r="0.7" fill="currentColor" />
										<circle cx="13.8" cy="12" r="0.7" fill="currentColor" />
									</svg>
									<span>{role}</span>
								</span>
								<span class="role-sep" aria-hidden="true">·</span>
								<span class="site">
									<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">
										<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7" />
										<path
											d="M3 12h18M12 3c2.5 2.8 3.8 5.8 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-5.8-3.8-9S9.5 5.8 12 3z"
											fill="none"
											stroke="currentColor"
											stroke-width="1.7"
										/>
									</svg>
									<span>{website.replace(/^https?:\/\//, '')}</span>
								</span>
							</p>
						</div>
						<div class="meta-contact">
							<span class="contact-item">
								<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">
									<path
										d="M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11z"
										fill="none"
										stroke="currentColor"
										stroke-width="1.7"
									/>
									<path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.7" />
								</svg>
								<span>{email}</span>
							</span>
							<span class="contact-item">
								<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">
									<path
										d="M7 3.8c.4-.4 1-.5 1.5-.3l2.2 1c.5.2.8.7.8 1.2v2.2c0 .4-.2.8-.5 1L9.5 10c.9 1.8 2.4 3.3 4.2 4.2l1.1-1.5c.3-.3.7-.5 1.1-.5h2.2c.5 0 1 .3 1.2.8l1 2.2c.2.5.1 1.1-.3 1.5l-1.2 1.2c-.4.4-1 .6-1.6.5C12.4 18.5 5.5 11.6 4.6 6.2c-.1-.6.1-1.2.5-1.6L7 3.8z"
										fill="none"
										stroke="currentColor"
										stroke-width="1.7"
										stroke-linejoin="round"
									/>
								</svg>
								<span>{phone}</span>
							</span>
						</div>
					</div>
				</div>

				<div class="card back" bind:this={backEl} aria-label="명함 뒷면"></div>
			</div>

			<div class="preview-actions">
				<button type="button" class="btn" on:click={() => (flipped = !flipped)}>
					{flipped ? '앞면 보기' : '뒷면 보기'}
				</button>
				<button type="button" class="btn" on:click={randomizeShapes}>도형 랜덤 생성</button>
				<button type="button" class="btn btn-primary" disabled={exporting} on:click={exportPdf}>
					{exporting ? '저장 중…' : 'PDF 저장'}
				</button>
				<button type="button" class="btn btn-primary" disabled={exporting} on:click={exportPng}>
					{exporting ? '저장 중…' : 'PNG 저장'}
				</button>
			</div>
			{#if exportMsg}
				<p class="export-msg">{exportMsg}</p>
			{/if}
		</div>

		<div class="controls">
			<div class="group">
				<p class="group-title">내용</p>
				<label>
					<span>이름</span>
					<input bind:value={name} />
				</label>
				<label>
					<span>태그라인 (saturation catea)</span>
					<input bind:value={tagline} />
				</label>
				<label>
					<span>직함</span>
					<input bind:value={role} />
				</label>
				<label>
					<span>웹사이트</span>
					<input bind:value={website} />
				</label>
				<label>
					<span>이메일</span>
					<input bind:value={email} />
				</label>
				<label>
					<span>전화번호</span>
					<input bind:value={phone} />
				</label>
			</div>

			<div class="group">
				<p class="group-title">글씨 크기</p>
				<label>
					<span>이름 {nameSize.toFixed(2)}rem</span>
					<input type="range" min="1.1" max="2.4" step="0.05" bind:value={nameSize} />
				</label>
				<label>
					<span>saturation catea {taglineSize.toFixed(2)}rem</span>
					<input type="range" min="0.55" max="1.4" step="0.02" bind:value={taglineSize} />
				</label>
				<label>
					<span>직함·링크·연락처 {metaSize.toFixed(2)}rem</span>
					<input type="range" min="0.5" max="0.95" step="0.02" bind:value={metaSize} />
				</label>
			</div>

			<div class="group">
				<p class="group-title">요소 간격</p>
				<label>
					<span>이름 ↔ 태그라인 {gapNameTagline}px</span>
					<input type="range" min="0" max="28" step="1" bind:value={gapNameTagline} />
				</label>
				<label>
					<span>태그라인 ↔ 직함 {gapTaglineRole}px</span>
					<input type="range" min="0" max="36" step="1" bind:value={gapTaglineRole} />
				</label>
				<label>
					<span>직함 · 웹 간격 {gapRoleItems.toFixed(2)}em</span>
					<input type="range" min="0.15" max="1.2" step="0.05" bind:value={gapRoleItems} />
				</label>
				<label>
					<span>연락처 간격 {gapContacts.toFixed(2)}em</span>
					<input type="range" min="0.3" max="2" step="0.05" bind:value={gapContacts} />
				</label>
				<label>
					<span>아이콘 ↔ 텍스트 {gapIconText.toFixed(2)}em</span>
					<input type="range" min="0.1" max="0.7" step="0.02" bind:value={gapIconText} />
				</label>
				<label>
					<span>좌우 여백 {padX}%</span>
					<input type="range" min="4" max="16" step="0.5" bind:value={padX} />
				</label>
				<label>
					<span>상하 여백 {padY}%</span>
					<input type="range" min="4" max="16" step="0.5" bind:value={padY} />
				</label>
			</div>

			<div class="group">
				<p class="group-title">도형 커스터마이즈</p>
				<label>
					<span>개수 {count}</span>
					<input type="range" min="6" max="28" bind:value={count} on:change={() => (shapeKey += 1)} />
				</label>
				<label>
					<span>속도 {speed}</span>
					<input type="range" min="0.2" max="1.5" step="0.05" bind:value={speed} />
				</label>
				<label>
					<span>선 투명도 {opacity}</span>
					<input type="range" min="0.04" max="0.25" step="0.01" bind:value={opacity} />
				</label>
				<label>
					<span>강조 투명도 {accentOpacity}</span>
					<input type="range" min="0.15" max="0.7" step="0.01" bind:value={accentOpacity} />
				</label>
				<label>
					<span>최소 크기 {minSize}</span>
					<input type="range" min="10" max="40" bind:value={minSize} on:change={() => (shapeKey += 1)} />
				</label>
				<label>
					<span>최대 크기 {maxSize}</span>
					<input type="range" min="40" max="100" bind:value={maxSize} on:change={() => (shapeKey += 1)} />
				</label>
				<label>
					<span>가장자리 오버플로우 {edgeOverflow.toFixed(2)}×</span>
					<input
						type="range"
						min="0"
						max="1.5"
						step="0.05"
						bind:value={edgeOverflow}
						on:change={() => (shapeKey += 1)}
					/>
				</label>
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	@import '../scss/variable.scss';

	.card-maker {
		margin-top: 72px;
		padding-top: 40px;
		border-top: 1px solid rgba($black-color, 0.12);
	}

	.label {
		margin: 0 0 8px;
		font-size: 0.72rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba($black-color, 0.4);
	}

	h2 {
		margin: 0 0 8px;
		font-size: 1.45rem;
		font-weight: 700;
		color: $black-color;
	}

	.lead {
		margin: 0 0 28px;
		font-size: 0.9rem;
		line-height: 1.6;
		color: rgba($black-color, 0.6);
	}

	.layout {
		display: grid;
		gap: 28px;
	}

	.preview-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}

	.stage {
		position: relative;
		width: min(100%, 420px);
		aspect-ratio: 90 / 50;
		perspective: 1200px;
	}

	.card {
		position: absolute;
		inset: 0;
		overflow: hidden;
		border: 1px solid rgba($black-color, 0.12);
		backface-visibility: hidden;
		transform-style: preserve-3d;
		transition: transform 0.55s ease;
	}

	.front {
		background: #fff;
		transform: rotateY(0deg);
	}

	.back {
		background: #37719e;
		transform: rotateY(180deg);
	}

	.stage.flipped .front {
		transform: rotateY(-180deg);
	}

	.stage.flipped .back {
		transform: rotateY(0deg);
	}

	.front-copy {
		position: relative;
		z-index: 1;
		height: 100%;
		box-sizing: border-box;
		padding: var(--pad-y, 8%) var(--pad-x, 9%);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		color: $black-color;
	}

	.front-main {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		flex: 1;
		width: 100%;
		max-width: 72%;
	}

	.name {
		margin: 0;
		font-size: var(--name-size, 1.7rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		color: $black-color;
		line-height: 1.1;
		text-align: left;
	}

	.tagline {
		margin: var(--gap-name-tagline, 6px) 0 0;
		font-size: var(--tagline-size, 0.88rem);
		font-weight: 500;
		letter-spacing: 0.04em;
		color: $black-color;
		opacity: 0.58;
		text-align: left;
	}

	.role-line {
		margin: var(--gap-tagline-role, 10px) 0 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35em var(--gap-role-items, 0.45em);
		font-size: var(--meta-size, 0.68rem);
		font-weight: 500;
		line-height: 1.35;
		color: $black-color;
		opacity: 0.72;
	}

	.role,
	.site,
	.role-sep {
		color: inherit;
		font-size: inherit;
		font-weight: inherit;
	}

	.role,
	.site {
		display: inline-flex;
		align-items: center;
		gap: var(--gap-icon-text, 0.28em);
	}

	.meta-contact {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35em var(--gap-contacts, 0.9em);
		font-size: var(--meta-size, 0.68rem);
		font-weight: 500;
		line-height: 1.35;
		color: $black-color;
		opacity: 0.72;
	}

	.contact-item {
		display: inline-flex;
		align-items: center;
		gap: var(--gap-icon-text, 0.28em);
		color: inherit;
		font-size: inherit;
		font-weight: inherit;
	}

	.ico {
		width: 1em;
		height: 1em;
		flex-shrink: 0;
		display: block;
		color: inherit;
	}

	.preview-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}

	.btn {
		padding: 9px 14px;
		border: 1.5px solid rgba($black-color, 0.25);
		background: transparent;
		color: $black-color;
		font-family: inherit;
		font-size: 0.84rem;
		cursor: pointer;

		&:hover:not(:disabled) {
			background: $black-color;
			color: #fff;
			border-color: $black-color;
		}

		&:disabled {
			opacity: 0.45;
			cursor: not-allowed;
		}
	}

	.btn-primary {
		background: $black-color;
		color: #fff;
		border-color: $black-color;
	}

	.export-msg {
		margin: 0;
		font-size: 0.82rem;
		color: rgba($black-color, 0.55);
		text-align: center;
	}

	.controls {
		display: grid;
		gap: 22px;
	}

	.group-title {
		margin: 0 0 10px;
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba($black-color, 0.4);
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-bottom: 10px;
		font-size: 0.78rem;
		color: rgba($black-color, 0.55);

		input[type='text'],
		input:not([type]),
		input[type='email'],
		input[type='tel'],
		input[type='url'] {
			padding: 10px 12px;
			border: 1.5px solid rgba($black-color, 0.2);
			font-family: inherit;
			font-size: 0.9rem;
			color: $black-color;
		}

		input[type='range'] {
			width: 100%;
		}
	}

	@media (min-width: 860px) {
		.layout {
			grid-template-columns: 1.1fr 0.9fr;
			align-items: start;
		}
	}
</style>
