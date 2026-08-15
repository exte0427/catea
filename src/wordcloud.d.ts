declare module 'wordcloud' {
	type WordCloudOptions = {
		list?: Array<[string, number, ...unknown[]]>;
		fontFamily?: string;
		fontWeight?: string | number | ((word: string, weight: number, fontSize: number) => string | number);
		color?: string | ((word: string, weight: number, fontSize: number, distance: number, theta: number) => string);
		minSize?: number;
		weightFactor?: number | ((size: number) => number);
		clearCanvas?: boolean;
		backgroundColor?: string;
		gridSize?: number;
		origin?: [number, number];
		drawOutOfBound?: boolean;
		shrinkToFit?: boolean;
		wait?: number;
		abortThreshold?: number;
		minRotation?: number;
		maxRotation?: number;
		rotationSteps?: number;
		shuffle?: boolean;
		rotateRatio?: number;
		shape?: string | ((theta: number) => number);
		ellipticity?: number;
	};

	interface WordCloudFn {
		(el: HTMLElement | HTMLElement[], options: WordCloudOptions): void;
		isSupported: boolean;
		minFontSize: number;
		stop: () => void;
	}

	const WordCloud: WordCloudFn;
	export default WordCloud;
}
