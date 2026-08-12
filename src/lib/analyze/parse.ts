import type { AnalyticsEvent } from './types';

export const parseJsonl = (text: string): AnalyticsEvent[] => {
	const events: AnalyticsEvent[] = [];
	const lines = text.split(/\r?\n/);
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();
		if (!line) continue;
		try {
			const obj = JSON.parse(line);
			if (obj && typeof obj === 'object' && typeof obj.event === 'string') {
				events.push(obj as AnalyticsEvent);
			}
		} catch {
			console.warn(`JSONL line ${i + 1} parse failed`);
		}
	}
	return events;
};

export const stageOf = (e: AnalyticsEvent) =>
	String(e.stage ?? e.stage_name ?? '').trim();

export const isEditorBuild = (build: string) =>
	/\+editor|editor-ping|-e2e/i.test(build);
