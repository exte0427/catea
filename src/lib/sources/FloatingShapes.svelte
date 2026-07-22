<script lang="ts">
	import { onMount } from 'svelte';

	type ShapeType = 'square' | 'triangle' | 'circle';

	interface Shape {
		id: number;
		type: ShapeType;
		x: number;
		y: number;
		size: number;
		vx: number;
		vy: number;
		rotation: number;
		rotationSpeed: number;
		accentStart: number;
		accentSpan: number;
	}

	/** 전체 속도 배율 (1 = 기본) */
	export let speed = 1;
	/** 도형 개수 */
	export let count = 14;
	/** 외곽선 색상 */
	export let strokeColor = '#57514a';
	/** 기본 외곽선 불투명도 (0~1) */
	export let opacity = 0.14;
	/** 강조 구간 불투명도 (0~1) */
	export let accentOpacity = 0.45;
	/** 외곽선 두께 (px) */
	export let strokeWidth = 1.5;
	/** 강조 구간 외곽선 두께 (px) */
	export let accentStrokeWidth = 2.2;
	/** 강조 구간 각도 범위 (deg) */
	export let accentMinSpan = 80;
	export let accentMaxSpan = 170;
	/** 도형 크기 범위 (px) */
	export let minSize = 28;
	export let maxSize = 80;
	/** 이동 속도 범위 (px/frame, speed 배율 적용 전) */
	export let minVelocity = 0.12;
	export let maxVelocity = 0.4;
	/** 회전 속도 범위 (deg/frame, speed 배율 적용 전) */
	export let minRotationSpeed = 0.08;
	export let maxRotationSpeed = 0.45;
	/**
	 * 가장자리 밖으로 나갈 수 있는 비율 (도형 반경 기준).
	 * 0 = 카드 안쪽에만, 1 = 절반까지 잘림, 1.5 = 더 많이 잘려도 됨
	 */
	export let edgeOverflow = 1.5;

	const shapeTypes: ShapeType[] = ['square', 'triangle', 'circle'];
	const pathLength = 360;

	let svgEl: SVGSVGElement;
	let shapes: Shape[] = [];
	let width = 0;
	let height = 0;
	let rafId = 0;

	const rand = (min: number, max: number) => min + Math.random() * (max - min);

	const boundsFor = (size: number) => {
		const half = size / 2;
		const pad = half * edgeOverflow;
		return {
			minX: half - pad,
			maxX: width - half + pad,
			minY: half - pad,
			maxY: height - half + pad
		};
	};

	const createShapes = () => {
		if (width <= 0 || height <= 0) return;

		shapes = Array.from({ length: count }, (_, id) => {
			const size = rand(minSize, maxSize);
			const velocity = rand(minVelocity, maxVelocity) * speed;
			const angle = rand(0, Math.PI * 2);
			const accentSpan = rand(accentMinSpan, accentMaxSpan);
			const b = boundsFor(size);

			return {
				id,
				type: shapeTypes[id % shapeTypes.length],
				x: rand(b.minX, b.maxX),
				y: rand(b.minY, b.maxY),
				size,
				vx: Math.cos(angle) * velocity,
				vy: Math.sin(angle) * velocity,
				rotation: rand(0, 360),
				rotationSpeed: rand(minRotationSpeed, maxRotationSpeed) * speed * (Math.random() > 0.5 ? 1 : -1),
				accentStart: rand(0, pathLength - accentSpan),
				accentSpan
			};
		});
	};

	const updateShapes = () => {
		shapes = shapes.map((shape) => {
			let { x, y, vx, vy, rotation, rotationSpeed, size } = shape;

			x += vx;
			y += vy;
			rotation += rotationSpeed;

			const b = boundsFor(size);

			if (x <= b.minX || x >= b.maxX) {
				vx *= -1;
				x = Math.max(b.minX, Math.min(b.maxX, x));
			}

			if (y <= b.minY || y >= b.maxY) {
				vy *= -1;
				y = Math.max(b.minY, Math.min(b.maxY, y));
			}

			return { ...shape, x, y, vx, vy, rotation };
		});
	};

	const animate = () => {
		if (shapes.length > 0) {
			updateShapes();
		}
		rafId = requestAnimationFrame(animate);
	};

	const trianglePoints = (cx: number, cy: number, size: number) => {
		const half = size / 2;
		const top = cy - half * 0.866;
		const bottom = cy + half * 0.866;
		return `${cx},${top} ${cx - half},${bottom} ${cx + half},${bottom}`;
	};

	const accentDash = (span: number) => `${span} ${pathLength - span}`;

	onMount(() => {
		const observer = new ResizeObserver((entries) => {
			const { width: w, height: h } = entries[0].contentRect;
			width = w;
			height = h;

			if (shapes.length === 0 && w > 0 && h > 0) {
				createShapes();
			}
		});

		observer.observe(svgEl);
		rafId = requestAnimationFrame(animate);

		return () => {
			observer.disconnect();
			cancelAnimationFrame(rafId);
		};
	});

	$: if (width > 0 && height > 0 && shapes.length !== count) {
		createShapes();
	}
</script>

<svg
	bind:this={svgEl}
	class="floating-shapes"
	{width}
	{height}
	viewBox="0 0 {width} {height}"
	aria-hidden="true"
>
	{#each shapes as shape (shape.id)}
		<g transform="rotate({shape.rotation} {shape.x} {shape.y})">
			{#if shape.type === 'circle'}
				<circle
					cx={shape.x}
					cy={shape.y}
					r={shape.size / 2}
					fill="none"
					stroke={strokeColor}
					stroke-width={strokeWidth}
					pathLength={pathLength}
					opacity={opacity}
				/>
				<circle
					cx={shape.x}
					cy={shape.y}
					r={shape.size / 2}
					fill="none"
					stroke={strokeColor}
					stroke-width={accentStrokeWidth}
					pathLength={pathLength}
					stroke-dasharray={accentDash(shape.accentSpan)}
					stroke-dashoffset={-shape.accentStart}
					opacity={accentOpacity}
					stroke-linecap="round"
				/>
			{:else if shape.type === 'square'}
				<rect
					x={shape.x - shape.size / 2}
					y={shape.y - shape.size / 2}
					width={shape.size}
					height={shape.size}
					fill="none"
					stroke={strokeColor}
					stroke-width={strokeWidth}
					pathLength={pathLength}
					opacity={opacity}
				/>
				<rect
					x={shape.x - shape.size / 2}
					y={shape.y - shape.size / 2}
					width={shape.size}
					height={shape.size}
					fill="none"
					stroke={strokeColor}
					stroke-width={accentStrokeWidth}
					pathLength={pathLength}
					stroke-dasharray={accentDash(shape.accentSpan)}
					stroke-dashoffset={-shape.accentStart}
					opacity={accentOpacity}
					stroke-linecap="round"
				/>
			{:else}
				<polygon
					points={trianglePoints(shape.x, shape.y, shape.size)}
					fill="none"
					stroke={strokeColor}
					stroke-width={strokeWidth}
					pathLength={pathLength}
					opacity={opacity}
				/>
				<polygon
					points={trianglePoints(shape.x, shape.y, shape.size)}
					fill="none"
					stroke={strokeColor}
					stroke-width={accentStrokeWidth}
					pathLength={pathLength}
					stroke-dasharray={accentDash(shape.accentSpan)}
					stroke-dashoffset={-shape.accentStart}
					opacity={accentOpacity}
					stroke-linecap="round"
				/>
			{/if}
		</g>
	{/each}
</svg>

<style lang="scss">
	.floating-shapes {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		overflow: hidden;
	}
</style>
