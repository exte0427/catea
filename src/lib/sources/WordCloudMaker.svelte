<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';

	const CENTER_WORD = '다미';
	const STOPWORDS = new Set([
		'그리고',
		'그러나',
		'하지만',
		'그래서',
		'그러므로',
		'또는',
		'혹은',
		'및',
		'등',
		'등등',
		'이것',
		'그것',
		'저것',
		'무엇',
		'어디',
		'언제',
		'어떻게',
		'왜',
		'어느',
		'어떤',
		'있다',
		'없다',
		'하다',
		'되다',
		'이다',
		'있는',
		'없는',
		'하는',
		'되는',
		'된',
		'한',
		'할',
		'그',
		'이',
		'저',
		'또',
		'더',
		'좀',
		'잘',
		'매우',
		'너무',
		'가장',
		'보다',
		'같이',
		'처럼',
		'위해',
		'위한',
		'통해',
		'대한',
		'대해',
		'관련',
		'따라',
		'우리',
		'저희',
		'사람',
		'때',
		'중',
		'후',
		'전',
		'속',
		'수',
		'것',
		'거',
		'점',
		'이번',
		'다음',
		'지금',
		'오늘',
		'어제',
		'내일',
		'여기',
		'거기',
		'저기',
		'때문에',
		'으로부터',
		'으로서',
		'에서',
		'the',
		'and',
		'for',
		'with',
		'that',
		'this',
		'from',
		'are',
		'was',
		'were'
	]);

	type Token = { key: string; display: string; count: number };

	let text = '';
	let density = 88;
	let maxWords = 120;
	let minLen = 2;
	let dropStop = true;
	let centerSize = 16;
	let maxSize = 8.5;
	let minSize = 1.35;
	let weight = 500;
	let centerWeight = 700;
	let curve = 1.45;
	let rotation: string = 'mixed';
	let bgLift = 8;
	let textLift = 96;
	let opacityMin = 0.42;
	let opacityMax = 0.96;
	let grain = 14;
	let margin = 3.5;
	let pixelSize = 1400;
	let seed = 1;
	let verticalShare = 28;

	let canvas: HTMLCanvasElement | null = null;
	let exporting = false;
	let exportMsg = '';
	let wordCount = 0;
	let placedCount = 0;
	let renderGen = 0;
	let timer: ReturnType<typeof setTimeout> | null = null;
	let ready = false;
	let WordCloud: typeof import('wordcloud').default | null = null;

	onMount(async () => {
		const mod = await import('wordcloud');
		WordCloud = mod.default;
		if (document.fonts?.ready) await document.fonts.ready;
		ready = true;
		queueRender();
	});

	onDestroy(() => {
		if (timer) clearTimeout(timer);
		WordCloud?.stop();
	});

	const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
	const mulberry = (s: number) => {
		let a = s >>> 0;
		return () => {
			a += 0x6d2b79f5;
			let t = a;
			t = Math.imul(t ^ (t >>> 15), t | 1);
			t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	};

	const splitKorean = (chunk: string) => {
		if (!/[가-힣]/.test(chunk)) return [chunk];
		return chunk
			.split(
				/에서부터|으로부터|으로서|에서|으로|로서|로써|부터|까지|에게|한테|께서|이나|든지|처럼|만큼|대로|이라고|라고|[은는이가을를의에와과도만요]/
			)
			.filter(Boolean);
	};

	const stripEnding = (word: string) =>
		word.replace(
			/입니다$|습니까$|습니다$|합니다$|됩니다$|했어요$|하였다$|했습니다$|했다$|한다$|이다$|예요$|이에요$|해요$|네요$/,
			''
		);

	const tokenize = (raw: string) => {
		const cleaned = raw.replace(/https?:\/\/\S+/gi, ' ').replace(/[\u200B-\u200D\uFEFF]/g, '');
		const chunks = cleaned.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
		const map = new Map<string, Token>();

		for (const chunk of chunks) {
			for (const piece of splitKorean(chunk)) {
				const stripped = stripEnding(piece);
				if (stripped.length < minLen) continue;
				const key = stripped.toLowerCase();
				if (key === CENTER_WORD) continue;
				if (dropStop && STOPWORDS.has(key)) continue;
				const prev = map.get(key);
				if (prev) prev.count += 1;
				else map.set(key, { key, display: stripped, count: 1 });
			}
		}

		return [...map.values()].sort((a, b) => b.count - a.count || a.display.localeCompare(b.display, 'ko'));
	};

	const bgRgb = () => {
		const v = Math.round(lerp(3, 36, bgLift / 100));
		return [v, Math.max(0, v - 1), Math.max(0, v - 3)] as const;
	};

	const bgCss = () => {
		const [r, g, b] = bgRgb();
		return `rgb(${r}, ${g}, ${b})`;
	};

	const ink = (alpha: number) => {
		const v = Math.round(lerp(214, 255, textLift / 100));
		return `rgba(${v}, ${v - 1}, ${Math.max(0, v - 8)}, ${alpha})`;
	};

	const squareShape = (theta: number) => {
		const sq = Math.min(1 / Math.abs(Math.cos(theta)), 1 / Math.abs(Math.sin(theta)));
		return sq * (1 - (margin / 100) * 1.8);
	};

	const rotationOpts = () => {
		if (rotation === 'none') {
			return { rotateRatio: 0, minRotation: 0, maxRotation: 0, rotationSteps: 0 };
		}
		if (rotation === 'slight') {
			return {
				rotateRatio: 0.72,
				minRotation: (-10 * Math.PI) / 180,
				maxRotation: (10 * Math.PI) / 180,
				rotationSteps: 0
			};
		}
		return {
			rotateRatio: Number(verticalShare) / 100,
			minRotation: -Math.PI / 2,
			maxRotation: Math.PI / 2,
			rotationSteps: 2
		};
	};

	const paintGrain = (ctx: CanvasRenderingContext2D, size: number) => {
		if (grain > 0) {
			const rand = mulberry(seed * 17 + 91);
			const dots = Math.round((grain / 100) * size * 2.8);
			ctx.save();
			ctx.globalAlpha = 0.04 + grain / 1600;
			ctx.fillStyle = '#fff';
			for (let i = 0; i < dots; i++) ctx.fillRect(rand() * size, rand() * size, 1, 1);
			ctx.restore();
		}
		ctx.strokeStyle = 'rgba(255,255,255,0.08)';
		ctx.lineWidth = Math.max(1, size * 0.0012);
		ctx.strokeRect(size * 0.01, size * 0.01, size * 0.98, size * 0.98);
	};

	const runCloud = (
		el: HTMLCanvasElement,
		options: Parameters<typeof import('wordcloud').default>[1]
	) =>
		new Promise<number>((resolve) => {
			if (!WordCloud) {
				resolve(0);
				return;
			}
			let drawn = 0;
			const onDrawn = (ev: Event) => {
				const detail = (ev as CustomEvent<{ drawn?: boolean }>).detail;
				if (detail?.drawn) drawn += 1;
			};
			const finish = () => {
				el.removeEventListener('wordclouddrawn', onDrawn);
				el.removeEventListener('wordcloudstop', finish);
				el.removeEventListener('wordcloudabort', finish);
				resolve(drawn);
			};
			el.addEventListener('wordclouddrawn', onDrawn);
			el.addEventListener('wordcloudstop', finish);
			el.addEventListener('wordcloudabort', finish);
			WordCloud(el, options);
		});

	const render = async () => {
		if (!browser || !canvas || !ready || !WordCloud) return;
		const gen = ++renderGen;
		WordCloud.stop();
		if (document.fonts?.ready) await document.fonts.ready;
		if (gen !== renderGen || !canvas) return;

		const size = Math.round(Number(pixelSize));
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const tokens = tokenize(text).slice(0, Number(maxWords));
		wordCount = tokens.length;
		const counts = tokens.map((t) => t.count);
		const hi = Math.max(...counts, 1);
		const lo = Math.min(...counts, 1);
		const maxPx = (Number(maxSize) / 100) * size;
		const minPx = (Number(minSize) / 100) * size;
		const list: Array<[string, number, number]> = tokens.map((token) => {
			const t = hi === lo ? 1 : (token.count - lo) / (hi - lo);
			const sized = minPx + Math.pow(t, Number(curve)) * (maxPx - minPx);
			return [token.display, sized, token.count];
		});

		const gridSize = Math.max(2, Math.round(lerp(12, 2, Number(density) / 100)));
		const backgroundColor = bgCss();
		const fontFamily = 'GMarketSans, Pretendard, "Apple SD Gothic Neo", sans-serif';
		const origin: [number, number] = [size / 2, size / 2];
		const rot = rotationOpts();
		const maxCount = Math.max(...tokens.map((t) => t.count), 1);

		const colorFor = (word: string, fontSize: number, count = 1) => {
			if (word === CENTER_WORD) return ink(Math.min(1, Number(opacityMax) + 0.04));
			const freq = count / maxCount;
			const sizeT = (fontSize - minPx) / (maxPx - minPx || 1);
			const t = Math.max(freq, sizeT);
			return ink(lerp(Number(opacityMin), Number(opacityMax), Math.pow(Math.max(0, t), 0.7)));
		};

		const common = {
			fontFamily,
			backgroundColor,
			gridSize,
			origin,
			shape: squareShape,
			ellipticity: 1,
			drawOutOfBound: false,
			shrinkToFit: true,
			wait: 0,
			abortThreshold: 0,
			shuffle: true,
			weightFactor: (n: number) => n,
			minSize: 0
		};

		const damiPx = (Number(centerSize) / 100) * size;
		const damiDrawn = await runCloud(canvas, {
			...common,
			list: [[CENTER_WORD, damiPx]],
			clearCanvas: true,
			rotateRatio: 0,
			minRotation: 0,
			maxRotation: 0,
			rotationSteps: 0,
			fontWeight: Number(centerWeight),
			color: () => colorFor(CENTER_WORD, damiPx)
		});
		if (gen !== renderGen || !canvas) return;

		let restDrawn = 0;
		if (list.length) {
			restDrawn = await runCloud(canvas, {
				...common,
				list,
				clearCanvas: false,
				...rot,
				fontWeight: (_word, _weight, fontSize) => {
					const t = (fontSize - minPx) / (maxPx - minPx || 1);
					if (t > 0.72) return Math.max(Number(weight), 600);
					if (t > 0.4) return Number(weight);
					return Math.min(Number(weight), 400);
				},
				color: (word, _weight, fontSize, _d, _th) => {
					const item = list.find((row) => row[0] === word);
					return colorFor(word, fontSize, item?.[2] ?? 1);
				}
			});
			if (gen !== renderGen || !canvas) return;
		}

		placedCount = damiDrawn + restDrawn;
		const overlay = canvas.getContext('2d');
		if (overlay) paintGrain(overlay, size);
	};

	const queueRender = () => {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			void render();
		}, 80);
	};

	$: if (ready && canvas) {
		canvas;
		text;
		density;
		maxWords;
		minLen;
		dropStop;
		centerSize;
		maxSize;
		minSize;
		weight;
		centerWeight;
		curve;
		rotation;
		bgLift;
		textLift;
		opacityMin;
		opacityMax;
		grain;
		margin;
		pixelSize;
		seed;
		verticalShare;
		queueRender();
	}

	const reroll = () => {
		seed += 1;
	};

	const exportPng = () => {
		if (!canvas || exporting) return;
		exporting = true;
		exportMsg = 'PNG 저장 중…';
		try {
			const a = document.createElement('a');
			a.href = canvas.toDataURL('image/png');
			a.download = 'dami-wordcloud.png';
			a.click();
			exportMsg = `정사각 PNG를 저장했습니다. (${pixelSize}×${pixelSize})`;
		} catch (err) {
			console.error(err);
			exportMsg = '저장에 실패했습니다.';
		} finally {
			exporting = false;
		}
	};
</script>

<section class="cloud-maker">
	<p class="label">글 · 워드클라우드</p>
	<h2>워드 클라우드</h2>
	<p class="lead">
		글을 넣으면 가운데에 ‘다미’가 있는 정사각 워드 클라우드가 빼곡히 채워집니다. 고빈도 단어는 더 크고 진하게
		그려집니다.
	</p>

	<label class="source">
		<span>원문</span>
		<textarea bind:value={text} rows="7" placeholder="워드 클라우드로 만들 글을 붙여넣으세요."></textarea>
	</label>

	<div class="layout">
		<div class="preview-wrap">
			<div class="stage">
				<canvas bind:this={canvas} width="1400" height="1400" aria-label="다미 워드 클라우드"></canvas>
			</div>
			<div class="preview-actions">
				<button type="button" class="btn" on:click={reroll}>다시 배치</button>
				<button type="button" class="btn btn-primary" disabled={exporting} on:click={exportPng}>
					{exporting ? '저장 중…' : 'PNG 저장'}
				</button>
			</div>
			<p class="meta">
				단어 {wordCount} · 배치 {Math.max(0, placedCount - 1)} · 가운데 {CENTER_WORD}
			</p>
			{#if exportMsg}
				<p class="export-msg">{exportMsg}</p>
			{/if}
		</div>

		<div class="controls">
			<div class="group">
				<p class="group-title">밀도 · 구성</p>
				<label>
					<span>밀도 {density}</span>
					<input type="range" min="20" max="100" step="1" bind:value={density} />
				</label>
				<label>
					<span>최대 단어 수 {maxWords}</span>
					<input type="range" min="12" max="220" step="1" bind:value={maxWords} />
				</label>
				<label>
					<span>최소 글자 수 {minLen}</span>
					<input type="range" min="1" max="6" step="1" bind:value={minLen} />
				</label>
				<label>
					<span>바깥 여백 {Number(margin).toFixed(1)}%</span>
					<input type="range" min="0" max="12" step="0.1" bind:value={margin} />
				</label>
				<label class="check">
					<input type="checkbox" bind:checked={dropStop} />
					<span>조사·불용어 제외</span>
				</label>
			</div>

			<div class="group">
				<p class="group-title">글씨 · 빈도</p>
				<label>
					<span>가운데 다미 {Number(centerSize).toFixed(1)}%</span>
					<input type="range" min="8" max="28" step="0.1" bind:value={centerSize} />
				</label>
				<label>
					<span>최대 글씨 {Number(maxSize).toFixed(1)}%</span>
					<input type="range" min="3" max="14" step="0.1" bind:value={maxSize} />
				</label>
				<label>
					<span>최소 글씨 {Number(minSize).toFixed(2)}%</span>
					<input type="range" min="0.7" max="4" step="0.05" bind:value={minSize} />
				</label>
				<label>
					<span>고빈도 강조 {Number(curve).toFixed(2)}</span>
					<input type="range" min="0.6" max="2.4" step="0.05" bind:value={curve} />
				</label>
				<label>
					<span>다미 굵기 {centerWeight}</span>
					<input type="range" min="300" max="700" step="100" bind:value={centerWeight} />
				</label>
				<label>
					<span>단어 굵기 {weight}</span>
					<input type="range" min="300" max="700" step="100" bind:value={weight} />
				</label>
			</div>

			<div class="group">
				<p class="group-title">방향 · 색</p>
				<label>
					<span>회전</span>
					<select bind:value={rotation}>
						<option value="none">가로만</option>
						<option value="mixed">가로 + 세로</option>
						<option value="slight">약한 기울기</option>
					</select>
				</label>
				<label>
					<span>세로 비율 {verticalShare}%</span>
					<input type="range" min="0" max="55" step="1" bind:value={verticalShare} />
				</label>
				<label>
					<span>배경 {bgLift}</span>
					<input type="range" min="0" max="100" step="1" bind:value={bgLift} />
				</label>
				<label>
					<span>글씨 밝기 {textLift}</span>
					<input type="range" min="70" max="100" step="1" bind:value={textLift} />
				</label>
				<label>
					<span>최소 투명도 {Number(opacityMin).toFixed(2)}</span>
					<input type="range" min="0.18" max="0.8" step="0.01" bind:value={opacityMin} />
				</label>
				<label>
					<span>최대 투명도 {Number(opacityMax).toFixed(2)}</span>
					<input type="range" min="0.55" max="1" step="0.01" bind:value={opacityMax} />
				</label>
				<label>
					<span>그레인 {grain}</span>
					<input type="range" min="0" max="80" step="1" bind:value={grain} />
				</label>
				<label>
					<span>출력 해상도 {pixelSize}px</span>
					<input type="range" min="800" max="2400" step="100" bind:value={pixelSize} />
				</label>
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	@import '../scss/variable.scss';

	.cloud-maker {
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

	.source {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 28px;
		font-size: 0.78rem;
		color: rgba($black-color, 0.55);

		textarea {
			width: 100%;
			box-sizing: border-box;
			padding: 14px 16px;
			border: 1.5px solid rgba($black-color, 0.2);
			border-radius: 0;
			background: transparent;
			color: $black-color;
			font-family: inherit;
			font-size: 0.92rem;
			line-height: 1.7;
			resize: vertical;
			min-height: 140px;

			&:focus {
				outline: none;
				border-color: rgba($black-color, 0.55);
			}

			&::placeholder {
				color: rgba($black-color, 0.35);
			}
		}
	}

	.layout {
		display: grid;
		gap: 28px;
	}

	.preview-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
	}

	.stage {
		width: min(100%, 520px);
		aspect-ratio: 1;
		background: #0c0b0a;
		border: 1px solid rgba($black-color, 0.12);
	}

	canvas {
		display: block;
		width: 100%;
		height: 100%;
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

	.meta,
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

		input[type='range'],
		select {
			width: 100%;
		}

		select {
			padding: 8px 10px;
			border: 1.5px solid rgba($black-color, 0.2);
			background: transparent;
			color: $black-color;
			font-family: inherit;
			font-size: 0.86rem;
		}
	}

	.check {
		flex-direction: row;
		align-items: center;
		gap: 8px;
		margin-top: 4px;

		input {
			width: auto;
		}
	}

	@media (min-width: 860px) {
		.layout {
			grid-template-columns: 1.1fr 0.9fr;
			align-items: start;
		}
	}
</style>
