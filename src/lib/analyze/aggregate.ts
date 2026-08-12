import { isEditorBuild, stageOf } from './parse';
import type {
	AnalyticsEvent,
	AnalyzeFilters,
	CombatStats,
	CompareStats,
	FunnelStep,
	ItemStats,
	NarrativeStats,
	OverviewStats,
	QualityStats,
	SessionMetaDoc,
	SessionRow,
	StageRow,
	SurveyJoinStats,
	SurveyResponse
} from './types';

export type SessionBundle = {
	meta: SessionMetaDoc;
	events: AnalyticsEvent[];
	survey?: SurveyResponse | null;
};

const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);

export const median = (nums: number[]) => {
	if (!nums.length) return 0;
	const a = [...nums].sort((x, y) => x - y);
	const mid = Math.floor(a.length / 2);
	return a.length % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
};

export const percentile = (nums: number[], p: number) => {
	if (!nums.length) return 0;
	const a = [...nums].sort((x, y) => x - y);
	const idx = Math.min(a.length - 1, Math.max(0, Math.ceil((p / 100) * a.length) - 1));
	return a[idx];
};

const dayKey = (ms: number) => {
	const d = new Date(ms);
	return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
};

const sessionStamp = (b: SessionBundle) => {
	const updated = b.meta.updatedAt ? Date.parse(b.meta.updatedAt) : NaN;
	if (Number.isFinite(updated) && updated > 0) return updated;
	return b.events.reduce((m, e) => Math.max(m, e.timestamp_ms || 0), 0) || Date.now();
};

export const filterSessions = (bundles: SessionBundle[], filters: AnalyzeFilters): SessionBundle[] =>
	bundles.filter(({ meta, events }) => {
		if (meta.product && meta.product !== 'DAMI') return false;
		if (filters.excludeEditor && isEditorBuild(meta.buildVersion)) return false;
		if (filters.builds.length && !filters.builds.includes(meta.buildVersion)) return false;
		if (filters.fromMs != null || filters.toMs != null) {
			const t = sessionStamp({ meta, events });
			if (filters.fromMs != null && t < filters.fromMs) return false;
			if (filters.toMs != null && t > filters.toMs) return false;
		}
		const duration = sessionDurationS(events, meta);
		if (filters.minDurationS > 0 && duration < filters.minDurationS) return false;
		if (filters.stage) {
			const hit = events.some((e) => stageOf(e) === filters.stage);
			if (!hit) return false;
		}
		return true;
	});

export const sessionDurationS = (events: AnalyticsEvent[], meta: SessionMetaDoc) => {
	const end = events.find((e) => e.event === 'session_end');
	const endDur = end ? num(end.duration_s) : null;
	if (endDur != null) return endDur;
	const metaDur = meta.meta ? num(meta.meta.duration_s) : null;
	if (metaDur != null) return metaDur;
	if (!events.length) return 0;
	const ts = events.map((e) => e.timestamp_ms || 0).filter(Boolean);
	if (!ts.length) return 0;
	return (Math.max(...ts) - Math.min(...ts)) / 1000;
};

const sessionHitRate = (events: AnalyticsEvent[]): number | null => {
	const summary = [...events].reverse().find((e) => e.event === 'combat_summary');
	if (summary) {
		const hr = num(summary.hit_rate);
		if (hr != null) return hr;
	}
	const swings = events.filter((e) => e.event === 'attack_swing').length;
	const hits = events.filter((e) => e.event === 'hit_dealt').length;
	if (!swings) return null;
	return hits / swings;
};

const stageDurationFromEvents = (events: AnalyticsEvent[], stage: string): number[] => {
	const fromSummary = events
		.filter((e) => e.event === 'stage_summary' && stageOf(e) === stage)
		.map((e) => num(e.duration_s))
		.filter((v): v is number => v != null);
	if (fromSummary.length) return fromSummary;
	return events
		.filter((e) => e.event === 'stage_exit' && stageOf(e) === stage)
		.map((e) => num(e.duration_s))
		.filter((v): v is number => v != null);
};

const finalClearStage = (stageOrder: string[], bundles: SessionBundle[]) => {
	const ordered = [...stageOrder].reverse();
	for (const stage of ordered) {
		const clears = bundles.filter((b) =>
			b.events.some((e) => e.event === 'stage_exit' && stageOf(e) === stage && e.reason === 'clear')
		).length;
		if (clears > 0) return { stage, clears };
	}
	return null;
};

/** 스테이지 순서 — 웹 config */
export const DEFAULT_STAGE_ORDER = ['Intro', 'stage-0', 'stage-1', 'stage-2', 'stage-3'];

export const discoverStages = (bundles: SessionBundle[], preferred = DEFAULT_STAGE_ORDER) => {
	const found = new Set<string>();
	for (const b of bundles) {
		for (const e of b.events) {
			const st = stageOf(e);
			if (st) found.add(st);
		}
	}
	const ordered = preferred.filter((s) => found.has(s));
	const rest = [...found].filter((s) => !preferred.includes(s)).sort();
	return [...ordered, ...rest];
};

export const buildOverview = (
	bundles: SessionBundle[],
	surveys: SurveyResponse[] = [],
	stageOrder: string[] = DEFAULT_STAGE_ORDER
): OverviewStats => {
	const sessions = bundles.length;
	let events = 0;
	let demoStarts = 0;
	let errorSessions = 0;
	let surveyShown = 0;
	const durations: number[] = [];
	const hitRates: number[] = [];
	const fpsSamples: number[] = [];
	const byDay = new Map<string, { count: number; deaths: number }>();
	const byBuild = new Map<string, number>();
	const endReasons = new Map<string, number>();
	const deathCauses = new Map<string, number>();
	const errorMsgs = new Map<string, number>();

	const surveyBySession = new Set(surveys.map((s) => s.sessionId));

	for (const b of bundles) {
		events += b.events.length;
		durations.push(sessionDurationS(b.events, b.meta));
		byBuild.set(b.meta.buildVersion, (byBuild.get(b.meta.buildVersion) || 0) + 1);

		if (b.events.some((e) => e.event === 'demo_start')) demoStarts += 1;
		if (b.events.some((e) => e.event === 'error')) errorSessions += 1;
		if (b.events.some((e) => e.event === 'survey_link_shown')) surveyShown += 1;

		const hr = sessionHitRate(b.events);
		if (hr != null) hitRates.push(hr);

		let sessionDeaths = 0;
		for (const e of b.events) {
			if (e.event === 'player_death') {
				sessionDeaths += 1;
				const cause = String(e.cause || 'unknown');
				deathCauses.set(cause, (deathCauses.get(cause) || 0) + 1);
			}
			if (e.event === 'perf_sample') {
				const fps = num(e.avg_fps);
				if (fps != null) fpsSamples.push(fps);
			}
			if (e.event === 'session_end') {
				const reason = String(e.reason || 'unknown');
				endReasons.set(reason, (endReasons.get(reason) || 0) + 1);
			}
			if (e.event === 'error') {
				const msg = String(e.message || 'error').slice(0, 120);
				errorMsgs.set(msg, (errorMsgs.get(msg) || 0) + 1);
			}
		}

		const day = dayKey(sessionStamp(b));
		const slot = byDay.get(day) || { count: 0, deaths: 0 };
		slot.count += 1;
		slot.deaths += sessionDeaths;
		byDay.set(day, slot);
	}

	const clearInfo = finalClearStage(stageOrder, bundles);
	const surveyResponses = bundles.filter(
		(b) => surveyBySession.has(b.meta.sessionId) || b.survey
	).length;
	const shownDenom = surveyShown || bundles.filter((b) => b.events.some((e) => e.event === 'demo_end')).length;

	const topDeaths = [...deathCauses.entries()]
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([label, count]) => ({ kind: 'death' as const, label, count }));
	const topErrors = [...errorMsgs.entries()]
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([label, count]) => ({ kind: 'error' as const, label, count }));

	return {
		sessions,
		events,
		medianDurationS: median(durations),
		demoStartRate: sessions ? demoStarts / sessions : 0,
		clearRate: clearInfo && sessions ? clearInfo.clears / sessions : null,
		medianHitRate: hitRates.length ? median(hitRates) : null,
		surveyResponseRate: shownDenom ? surveyResponses / shownDenom : null,
		errorSessionRate: sessions ? errorSessions / sessions : 0,
		medianFps: fpsSamples.length ? median(fpsSamples) : null,
		sessionsByDay: [...byDay.entries()]
			.sort((a, b) => a[0].localeCompare(b[0]))
			.map(([day, v]) => ({ day, count: v.count, deaths: v.deaths })),
		sessionsByBuild: [...byBuild.entries()]
			.sort((a, b) => b[1] - a[1])
			.map(([build, count]) => ({ build, count })),
		endReasons: [...endReasons.entries()]
			.sort((a, b) => b[1] - a[1])
			.map(([reason, count]) => ({ reason, count })),
		topIssues: [...topDeaths, ...topErrors].sort((a, b) => b.count - a.count).slice(0, 8),
		n: {
			demoStarts,
			clears: clearInfo?.clears || 0,
			hitRateSamples: hitRates.length,
			surveyShown: shownDenom,
			surveyResponses,
			errorSessions,
			fpsSamples: fpsSamples.length
		}
	};
};

export const buildFunnel = (
	bundles: SessionBundle[],
	stageOrder: string[] = DEFAULT_STAGE_ORDER,
	surveyCount = 0
): FunnelStep[] => {
	const n = bundles.length || 1;
	const countEv = (pred: (e: AnalyticsEvent) => boolean) =>
		bundles.filter((b) => b.events.some(pred)).length;

	const steps: FunnelStep[] = [];
	const push = (id: string, label: string, count: number, prevCount: number) => {
		steps.push({
			id,
			label,
			count,
			rate: n ? count / n : 0,
			dropOff: prevCount ? 1 - count / prevCount : 0,
			dropAbs: Math.max(0, prevCount - count)
		});
	};

	const sessionStart = countEv((e) => e.event === 'session_start') || bundles.length;
	push('session_start', 'session_start', sessionStart, sessionStart);

	const demoStart = countEv((e) => e.event === 'demo_start');
	push('demo_start', 'demo_start', demoStart, sessionStart);

	let prev = demoStart || sessionStart;
	const stages = stageOrder.length ? stageOrder : discoverStages(bundles);
	for (const stage of stages) {
		const entered = countEv((e) => e.event === 'stage_enter' && stageOf(e) === stage);
		push(`enter:${stage}`, `enter ${stage}`, entered, prev);
		prev = entered || prev;
		const cleared = countEv(
			(e) => e.event === 'stage_exit' && stageOf(e) === stage && e.reason === 'clear'
		);
		push(`clear:${stage}`, `clear ${stage}`, cleared, entered || prev);
		prev = cleared || prev;
	}

	const demoEnd = countEv((e) => e.event === 'demo_end');
	push('demo_end', 'demo_end', demoEnd, prev);
	prev = demoEnd || prev;

	const shown = countEv((e) => e.event === 'survey_link_shown');
	push('survey_link_shown', 'survey_link_shown', shown, prev);
	prev = shown || prev;

	push('survey_submitted', 'survey submitted', surveyCount, prev);
	return steps;
};

export const buildStages = (
	bundles: SessionBundle[],
	stageOrder?: string[]
): StageRow[] => {
	const stages = stageOrder?.length ? stageOrder : discoverStages(bundles);
	return stages
		.map((stage) => {
			const reachSet = new Set<string>();
			const clearSet = new Set<string>();
			let deaths = 0;
			let itemUses = 0;
			const hitRates: number[] = [];
			const durations: number[] = [];
			let usedSummary = false;

			for (const b of bundles) {
				const sid = b.meta.sessionId;
				if (b.events.some((e) => e.event === 'stage_enter' && stageOf(e) === stage)) {
					reachSet.add(sid);
				}
				if (
					b.events.some(
						(e) => e.event === 'stage_exit' && stageOf(e) === stage && e.reason === 'clear'
					)
				) {
					clearSet.add(sid);
				}

				const summaries = b.events.filter((e) => e.event === 'stage_summary' && stageOf(e) === stage);
				if (summaries.length) {
					usedSummary = true;
					for (const e of summaries) {
						deaths += num(e.deaths) || 0;
						itemUses += num(e.item_uses) || 0;
						const hr = num(e.hit_rate);
						if (hr != null) hitRates.push(hr);
					}
				}
				durations.push(...stageDurationFromEvents(b.events, stage));
			}

			if (!usedSummary) {
				for (const b of bundles) {
					for (const e of b.events) {
						if (stageOf(e) !== stage) continue;
						if (e.event === 'player_death') deaths += 1;
						if (e.event === 'item_use') itemUses += 1;
					}
				}
			}

			const reach = reachSet.size;
			const clears = clearSet.size;
			return {
				stage,
				reach,
				clears,
				clearRate: reach ? clears / reach : 0,
				medianDurationS: median(durations),
				p90DurationS: percentile(durations, 90),
				deathsPerSession: reach ? deaths / reach : 0,
				medianHitRate: hitRates.length ? median(hitRates) : null,
				itemUsesPerSession: reach ? itemUses / reach : 0,
				deaths,
				itemUses
			};
		})
		.filter((r) => r.reach > 0 || r.deaths > 0);
};

export const buildDeathPoints = (bundles: SessionBundle[], stage: string) => {
	const pts: { x: number; z: number; cause: string; sessionId: string }[] = [];
	for (const b of bundles) {
		for (const e of b.events) {
			if (e.event !== 'player_death') continue;
			if (stage && stageOf(e) !== stage) continue;
			if (typeof e.x !== 'number' || typeof e.z !== 'number') continue;
			pts.push({
				x: e.x,
				z: e.z,
				cause: String(e.cause || 'unknown'),
				sessionId: b.meta.sessionId
			});
		}
	}
	return pts;
};

export const buildCauseBreakdown = (bundles: SessionBundle[], stage = '') => {
	const map = new Map<string, number>();
	for (const b of bundles) {
		for (const e of b.events) {
			if (e.event !== 'player_death') continue;
			if (stage && stageOf(e) !== stage) continue;
			const cause = String(e.cause || 'unknown');
			map.set(cause, (map.get(cause) || 0) + 1);
		}
	}
	return [...map.entries()]
		.sort((a, b) => b[1] - a[1])
		.map(([cause, count]) => ({ cause, count }));
};

export const buildCheckpointReach = (bundles: SessionBundle[], stage = '') => {
	const map = new Map<string, number>();
	for (const b of bundles) {
		const keys = new Set<string>();
		for (const e of b.events) {
			if (e.event !== 'checkpoint_reached') continue;
			if (stage && stageOf(e) !== stage) continue;
			keys.add(String(e.restore_key || 'unknown'));
		}
		for (const k of keys) map.set(k, (map.get(k) || 0) + 1);
	}
	return [...map.entries()]
		.sort((a, b) => b[1] - a[1])
		.map(([key, count]) => ({ key, count }));
};

export const buildCombat = (bundles: SessionBundle[]): CombatStats => {
	const sessionRates: number[] = [];
	const normalRates: number[] = [];
	const specialRates: number[] = [];
	let totalSwings = 0;
	let totalHits = 0;
	let totalAbsorbs = 0;
	let totalHitTaken = 0;
	let totalDuration = 0;
	let sessionsWithCombat = 0;

	const stageRates = new Map<string, number[]>();
	const stageNormal = new Map<string, number[]>();
	const stageSpecial = new Map<string, number[]>();
	const weapons = new Map<string, number>();
	const kills = new Map<string, number>();
	const absorbsByStage = new Map<string, number>();
	const hitSources = new Map<string, number>();

	for (const b of bundles) {
		const dur = sessionDurationS(b.events, b.meta);
		totalDuration += dur;
		const swings = b.events.filter((e) => e.event === 'attack_swing');
		const hits = b.events.filter((e) => e.event === 'hit_dealt');
		const absorbs = b.events.filter((e) => e.event === 'absorb');
		const taken = b.events.filter((e) => e.event === 'hit_taken');
		totalSwings += swings.length;
		totalHits += hits.length;
		totalAbsorbs += absorbs.length;
		totalHitTaken += taken.length;
		if (swings.length || hits.length || b.events.some((e) => e.event === 'combat_summary')) {
			sessionsWithCombat += 1;
		}

		const summary = [...b.events].reverse().find((e) => e.event === 'combat_summary');
		const hr = summary ? num(summary.hit_rate) : swings.length ? hits.length / swings.length : null;
		if (hr != null) sessionRates.push(hr);
		const nhr = summary ? num(summary.normal_hit_rate) : null;
		const shr = summary ? num(summary.special_hit_rate) : null;
		if (nhr != null) normalRates.push(nhr);
		if (shr != null) specialRates.push(shr);

		for (const e of b.events) {
			if (e.event === 'stage_summary') {
				const st = stageOf(e) || '(unknown)';
				const r = num(e.hit_rate);
				if (r != null) {
					if (!stageRates.has(st)) stageRates.set(st, []);
					stageRates.get(st)!.push(r);
				}
				const nr = num(e.normal_hit_rate);
				const sr = num(e.special_hit_rate);
				if (nr != null) {
					if (!stageNormal.has(st)) stageNormal.set(st, []);
					stageNormal.get(st)!.push(nr);
				}
				if (sr != null) {
					if (!stageSpecial.has(st)) stageSpecial.set(st, []);
					stageSpecial.get(st)!.push(sr);
				}
			}
			if (e.event === 'attack_swing') {
				const mode = String(e.weapon_mode || (e.special ? 'special' : 'normal'));
				weapons.set(mode, (weapons.get(mode) || 0) + 1);
			}
			if (e.event === 'enemy_kill') {
				const enemy = String(e.enemy_type || 'unknown');
				kills.set(enemy, (kills.get(enemy) || 0) + 1);
			}
			if (e.event === 'absorb') {
				const st = stageOf(e) || '(unknown)';
				absorbsByStage.set(st, (absorbsByStage.get(st) || 0) + 1);
			}
			if (e.event === 'hit_taken') {
				const src = String(e.source || 'unknown');
				hitSources.set(src, (hitSources.get(src) || 0) + 1);
			}
		}
	}

	const histBuckets = [0, 0.2, 0.4, 0.6, 0.8, 1.01];
	const hist = histBuckets.slice(0, -1).map((lo, i) => {
		const hi = histBuckets[i + 1];
		const label = `${Math.round(lo * 100)}–${Math.round(hi * 100)}%`;
		const count = sessionRates.filter((r) => r >= lo && r < hi).length;
		return { bucket: label, count };
	});

	const minutes = totalDuration / 60;

	return {
		medianHitRate: sessionRates.length ? median(sessionRates) : null,
		medianNormalHitRate: normalRates.length ? median(normalRates) : null,
		medianSpecialHitRate: specialRates.length ? median(specialRates) : null,
		swingsPerMinute: minutes > 0 ? totalSwings / minutes : null,
		absorbsPerSession: bundles.length ? totalAbsorbs / bundles.length : 0,
		hitTakenPerMinute: minutes > 0 ? totalHitTaken / minutes : null,
		hitRateHist: hist,
		byStage: [...stageRates.entries()]
			.map(([stage, arr]) => ({
				stage,
				medianHitRate: arr.length ? median(arr) : null,
				n: arr.length
			}))
			.sort((a, b) => a.stage.localeCompare(b.stage)),
		normalVsSpecial: [
			...new Set([...stageNormal.keys(), ...stageSpecial.keys()])
		]
			.map((stage) => ({
				stage,
				normal: stageNormal.get(stage)?.length ? median(stageNormal.get(stage)!) : null,
				special: stageSpecial.get(stage)?.length ? median(stageSpecial.get(stage)!) : null,
				n: Math.max(stageNormal.get(stage)?.length || 0, stageSpecial.get(stage)?.length || 0)
			}))
			.sort((a, b) => a.stage.localeCompare(b.stage)),
		weaponModes: [...weapons.entries()]
			.sort((a, b) => b[1] - a[1])
			.map(([mode, count]) => ({ mode, count })),
		killMix: [...kills.entries()]
			.sort((a, b) => b[1] - a[1])
			.map(([enemy, count]) => ({ enemy, count })),
		absorbsByStage: [...absorbsByStage.entries()]
			.sort((a, b) => b[1] - a[1])
			.map(([stage, count]) => ({ stage, count })),
		hitTakenSources: [...hitSources.entries()]
			.sort((a, b) => b[1] - a[1])
			.slice(0, 12)
			.map(([source, count]) => ({ source, count })),
		n: { sessionsWithCombat, swings: totalSwings, hits: totalHits }
	};
};

export const buildItems = (bundles: SessionBundle[]): ItemStats => {
	const byItem = new Map<string, { count: number; sessions: Set<string>; uses: number[] }>();
	const byStage = new Map<string, number>();
	const firstUse = new Map<string, number[]>();
	const reasons = new Map<string, number>();
	const sessionMaxUses: number[] = [];
	let nearDeathBandage = 0;
	let deathSessions = 0;

	for (const b of bundles) {
		const uses = b.events.filter((e) => e.event === 'item_use');
		const perItemMax = new Map<string, number>();
		for (const e of uses) {
			const itemId = String(e.item_id || 'unknown');
			const slot = byItem.get(itemId) || { count: 0, sessions: new Set<string>(), uses: [] };
			slot.count += 1;
			slot.sessions.add(b.meta.sessionId);
			byItem.set(itemId, slot);
			const idx = num(e.use_index) || 1;
			perItemMax.set(itemId, Math.max(perItemMax.get(itemId) || 0, idx));
			const st = stageOf(e) || '(unknown)';
			const key = `${st}||${itemId}`;
			byStage.set(key, (byStage.get(key) || 0) + 1);
			const reason = String(e.reason || 'unknown');
			reasons.set(reason, (reasons.get(reason) || 0) + 1);
			const rt = num(e.realtime_s);
			if (rt != null) {
				if (!firstUse.has(itemId)) firstUse.set(itemId, []);
				// collect all; median of firsts computed later per session
			}
		}
		for (const [itemId, maxU] of perItemMax) {
			byItem.get(itemId)!.uses.push(maxU);
		}
		if (perItemMax.size) {
			sessionMaxUses.push(Math.max(...perItemMax.values()));
		}

		// first use realtime per item in session
		const seen = new Set<string>();
		for (const e of [...uses].sort((a, b) => (a.realtime_s || 0) - (b.realtime_s || 0))) {
			const itemId = String(e.item_id || 'unknown');
			if (seen.has(itemId)) continue;
			seen.add(itemId);
			const rt = num(e.realtime_s);
			if (rt != null) {
				if (!firstUse.has(itemId)) firstUse.set(itemId, []);
				firstUse.get(itemId)!.push(rt);
			}
		}

		const deaths = b.events.filter((e) => e.event === 'player_death');
		if (deaths.length) {
			deathSessions += 1;
			const usedNear = deaths.some((d) => {
				const t = d.timestamp_ms || 0;
				return uses.some(
					(u) =>
						String(u.item_id || '').includes('band') &&
						(u.timestamp_ms || 0) <= t &&
						(u.timestamp_ms || 0) >= t - 60000
				);
			});
			if (usedNear) nearDeathBandage += 1;
		}
	}

	const usesHistBuckets = [0, 1, 2, 3, 5, 10, 999];
	const usesHist = usesHistBuckets.slice(0, -1).map((lo, i) => {
		const hi = usesHistBuckets[i + 1];
		const label = hi >= 999 ? `${lo}+` : `${lo}–${hi - 1}`;
		return {
			bucket: label,
			count: sessionMaxUses.filter((u) => u >= lo && u < hi).length
		};
	});

	return {
		byItem: [...byItem.entries()]
			.map(([itemId, v]) => ({
				itemId,
				count: v.count,
				sessions: v.sessions.size,
				meanUses: v.uses.length ? v.uses.reduce((a, b) => a + b, 0) / v.uses.length : 0
			}))
			.sort((a, b) => b.count - a.count),
		usesHist,
		byStage: [...byStage.entries()]
			.map(([key, count]) => {
				const [stage, itemId] = key.split('||');
				return { stage, itemId, count };
			})
			.sort((a, b) => b.count - a.count),
		firstUse: [...firstUse.entries()]
			.map(([itemId, arr]) => ({
				itemId,
				medianRealtimeS: median(arr),
				n: arr.length
			}))
			.sort((a, b) => a.medianRealtimeS - b.medianRealtimeS),
		reasons: [...reasons.entries()]
			.sort((a, b) => b[1] - a[1])
			.map(([reason, count]) => ({ reason, count })),
		nearDeathBandageRate: deathSessions ? nearDeathBandage / deathSessions : null,
		n: {
			totalUses: [...byItem.values()].reduce((a, v) => a + v.count, 0),
			sessionsWithItem: new Set(
				[...byItem.values()].flatMap((v) => [...v.sessions])
			).size
		}
	};
};

export const buildNarrative = (bundles: SessionBundle[]): NarrativeStats => {
	const dialogue = new Map<string, number>();
	const choices = new Map<string, { label: string; count: number }>();
	const tutorialShown = new Map<string, number>();
	const tutorialDone = new Map<string, number>();

	for (const b of bundles) {
		const dlg = new Set<string>();
		const tutS = new Set<string>();
		const tutC = new Set<string>();
		for (const e of b.events) {
			if (e.event === 'dialogue_start') {
				dlg.add(String(e.node_id || 'unknown'));
			}
			if (e.event === 'dialogue_choice') {
				const id = String(e.choice_id || 'unknown');
				const label = String(e.label || id);
				const slot = choices.get(id) || { label, count: 0 };
				slot.count += 1;
				slot.label = label;
				choices.set(id, slot);
			}
			if (e.event === 'tutorial_step') {
				const id = String(e.id || 'unknown');
				const status = String(e.status || '');
				if (status === 'shown') tutS.add(id);
				if (status === 'completed') tutC.add(id);
			}
		}
		for (const id of dlg) dialogue.set(id, (dialogue.get(id) || 0) + 1);
		for (const id of tutS) tutorialShown.set(id, (tutorialShown.get(id) || 0) + 1);
		for (const id of tutC) tutorialDone.set(id, (tutorialDone.get(id) || 0) + 1);
	}

	const tutIds = new Set([...tutorialShown.keys(), ...tutorialDone.keys()]);
	return {
		dialogueStarts: [...dialogue.entries()]
			.sort((a, b) => b[1] - a[1])
			.map(([nodeId, count]) => ({ nodeId, count })),
		choices: [...choices.entries()]
			.sort((a, b) => b[1].count - a[1].count)
			.map(([choiceId, v]) => ({ choiceId, label: v.label, count: v.count })),
		tutorial: [...tutIds]
			.map((id) => {
				const shown = tutorialShown.get(id) || 0;
				const completed = tutorialDone.get(id) || 0;
				return { id, shown, completed, incomplete: Math.max(0, shown - completed) };
			})
			.sort((a, b) => b.shown - a.shown)
	};
};

export const buildQuality = (bundles: SessionBundle[]): QualityStats => {
	const fpsByDay = new Map<string, number[]>();
	const fpsByStage = new Map<string, number[]>();
	const hitches: number[] = [];
	const errors = new Map<string, { count: number; sessions: Set<string> }>();
	const errorsByDay = new Map<string, number>();
	let samples = 0;
	let errorEvents = 0;

	for (const b of bundles) {
		for (const e of b.events) {
			if (e.event === 'perf_sample') {
				samples += 1;
				const fps = num(e.avg_fps);
				const day = dayKey(e.timestamp_ms || sessionStamp(b));
				if (fps != null) {
					if (!fpsByDay.has(day)) fpsByDay.set(day, []);
					fpsByDay.get(day)!.push(fps);
					const st = stageOf(e) || '(unknown)';
					if (!fpsByStage.has(st)) fpsByStage.set(st, []);
					fpsByStage.get(st)!.push(fps);
				}
				const hitch = num(e.max_frame_ms);
				if (hitch != null) hitches.push(hitch);
			}
			if (e.event === 'error') {
				errorEvents += 1;
				const msg = String(e.message || 'error').slice(0, 160);
				const slot = errors.get(msg) || { count: 0, sessions: new Set<string>() };
				slot.count += 1;
				slot.sessions.add(b.meta.sessionId);
				errors.set(msg, slot);
				const day = dayKey(e.timestamp_ms || sessionStamp(b));
				errorsByDay.set(day, (errorsByDay.get(day) || 0) + 1);
			}
		}
	}

	return {
		fpsByDay: [...fpsByDay.entries()]
			.sort((a, b) => a[0].localeCompare(b[0]))
			.map(([day, arr]) => ({
				day,
				avgFps: arr.reduce((a, b) => a + b, 0) / arr.length,
				n: arr.length
			})),
		fpsByStage: [...fpsByStage.entries()]
			.map(([stage, arr]) => ({
				stage,
				medianFps: median(arr),
				n: arr.length
			}))
			.sort((a, b) => a.stage.localeCompare(b.stage)),
		hitchP95: hitches.length ? percentile(hitches, 95) : null,
		errors: [...errors.entries()]
			.sort((a, b) => b[1].count - a[1].count)
			.map(([message, v]) => ({
				message,
				count: v.count,
				sessions: v.sessions.size
			})),
		errorsByDay: [...errorsByDay.entries()]
			.sort((a, b) => a[0].localeCompare(b[0]))
			.map(([day, count]) => ({ day, count })),
		n: { samples, errorEvents }
	};
};

export const buildSessionRows = (bundles: SessionBundle[]): SessionRow[] =>
	bundles
		.map((b) => {
			const deaths = b.events.filter((e) => e.event === 'player_death').length;
			const stages = [
				...new Set(
					b.events.filter((e) => e.event === 'stage_enter').map((e) => stageOf(e)).filter(Boolean)
				)
			];
			const start = b.events.find((e) => e.event === 'session_start');
			return {
				sessionId: b.meta.sessionId,
				buildVersion: b.meta.buildVersion,
				durationS: sessionDurationS(b.events, b.meta),
				stagesReached: stages,
				deaths,
				hitRate: sessionHitRate(b.events),
				itemUses: b.events.filter((e) => e.event === 'item_use').length,
				hasSurvey: Boolean(b.survey),
				hasError: b.events.some((e) => e.event === 'error'),
				updatedAt: b.meta.updatedAt || '',
				eventCount: b.events.length,
				deviceId: String(start?.device_id || b.meta.meta?.device_id || '')
			};
		})
		.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));

export const buildSurveyStats = (
	bundles: SessionBundle[],
	surveys: SurveyResponse[]
): SurveyJoinStats => {
	const shown = bundles.filter((b) => b.events.some((e) => e.event === 'survey_link_shown')).length;
	const bySession = new Map(bundles.map((b) => [b.meta.sessionId, b]));
	const labelOf: Record<string, string> = {
		mechanism: '메커니즘 이해',
		story: '스토리 이해',
		controls: '조작감',
		combat: '전투 만족',
		lacking: '가장 부족한 부분',
		feedback: '피드백'
	};

	const likertKeys = ['mechanism', 'story', 'controls', 'combat'] as const;
	const likertAverages = likertKeys.map((key) => {
		const nums = surveys
			.map((s) => Number(s.answers?.[key]))
			.filter((n) => Number.isFinite(n) && n >= 1 && n <= 5);
		return {
			key,
			label: labelOf[key],
			avg: nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null,
			n: nums.length
		};
	});

	const byQuestion = likertKeys.map((key) => {
		const values = new Map<string, number>();
		for (let i = 1; i <= 5; i++) values.set(String(i), 0);
		for (const s of surveys) {
			const v = Number(s.answers?.[key]);
			if (!Number.isFinite(v)) continue;
			const k = String(Math.round(v));
			if (!values.has(k)) values.set(k, 0);
			values.set(k, (values.get(k) || 0) + 1);
		}
		return {
			key,
			label: labelOf[key],
			values: [...values.entries()].map(([value, count]) => ({ value, count }))
		};
	});

	const lackingMap = new Map<string, number>();
	for (const s of surveys) {
		const v = String(s.answers?.lacking || '').trim();
		if (!v) continue;
		lackingMap.set(v, (lackingMap.get(v) || 0) + 1);
	}

	const feedbacks = surveys
		.map((s) => ({
			sessionId: s.sessionId,
			build: s.build || '',
			text: String(s.answers?.feedback || s.freeText || '').trim(),
			createdAt: s.createdAt || ''
		}))
		.filter((f) => f.text)
		.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

	const cross = surveys.map((s) => {
		const b = bySession.get(s.sessionId);
		const numOrNull = (v: unknown) => {
			const n = Number(v);
			return Number.isFinite(n) ? n : null;
		};
		return {
			sessionId: s.sessionId,
			build: s.build || b?.meta.buildVersion || '',
			mechanism: numOrNull(s.answers?.mechanism),
			story: numOrNull(s.answers?.story),
			controls: numOrNull(s.answers?.controls),
			combat: numOrNull(s.answers?.combat),
			lacking: String(s.answers?.lacking || '-'),
			difficulty: s.difficulty ?? numOrNull(s.answers?.mechanism),
			deaths: b ? b.events.filter((e) => e.event === 'player_death').length : null,
			hitRate: b ? sessionHitRate(b.events) : null,
			durationS: b ? sessionDurationS(b.events, b.meta) : null,
			freeText: String(s.answers?.feedback || s.freeText || '')
		};
	});

	return {
		shown,
		submitted: surveys.length,
		responseRate: shown ? surveys.length / shown : null,
		likertAverages,
		byQuestion,
		lacking: [...lackingMap.entries()]
			.sort((a, b) => b[1] - a[1])
			.map(([value, count]) => ({ value, count })),
		feedbacks,
		cross
	};
};

export const buildCompare = (
	all: SessionBundle[],
	buildA: string,
	buildB: string,
	baseFilters: AnalyzeFilters
): CompareStats => {
	const a = filterSessions(all, { ...baseFilters, builds: [buildA], excludeEditor: false });
	const b = filterSessions(all, { ...baseFilters, builds: [buildB], excludeEditor: false });
	const ovA = buildOverview(a);
	const ovB = buildOverview(b);
	const stA = buildStages(a);
	const stB = buildStages(b);
	const stages = discoverStages([...a, ...b]);

	const delta = (
		key: string,
		label: string,
		va: number | null,
		vb: number | null,
		unit: CompareStats['deltas'][0]['unit'],
		nA: number,
		nB: number
	) => ({
		key,
		label,
		a: va,
		b: vb,
		delta: va != null && vb != null ? vb - va : null,
		unit,
		nA,
		nB
	});

	const stageMapA = new Map(stA.map((s) => [s.stage, s]));
	const stageMapB = new Map(stB.map((s) => [s.stage, s]));

	return {
		buildA,
		buildB,
		nA: a.length,
		nB: b.length,
		lowN: a.length < 30 || b.length < 30,
		deltas: [
			delta('sessions', 'Sessions', ovA.sessions, ovB.sessions, 'count', a.length, b.length),
			delta(
				'duration',
				'Median duration',
				ovA.medianDurationS,
				ovB.medianDurationS,
				'seconds',
				a.length,
				b.length
			),
			delta(
				'demo',
				'Demo start rate',
				ovA.demoStartRate,
				ovB.demoStartRate,
				'rate',
				ovA.n.demoStarts,
				ovB.n.demoStarts
			),
			delta('hit', 'Median hit rate', ovA.medianHitRate, ovB.medianHitRate, 'rate', ovA.n.hitRateSamples, ovB.n.hitRateSamples),
			delta(
				'error',
				'Error session rate',
				ovA.errorSessionRate,
				ovB.errorSessionRate,
				'rate',
				ovA.n.errorSessions,
				ovB.n.errorSessions
			)
		],
		funnelA: buildFunnel(a, stages),
		funnelB: buildFunnel(b, stages),
		stages: stages.map((stage) => {
			const sa = stageMapA.get(stage);
			const sb = stageMapB.get(stage);
			return {
				stage,
				durationA: sa?.medianDurationS ?? null,
				durationB: sb?.medianDurationS ?? null,
				deathsA: sa?.deathsPerSession ?? null,
				deathsB: sb?.deathsPerSession ?? null,
				hitA: sa?.medianHitRate ?? null,
				hitB: sb?.medianHitRate ?? null
			};
		})
	};
};

export const collectBuildVersions = (metas: SessionMetaDoc[]) =>
	[...new Set(metas.map((m) => m.buildVersion).filter(Boolean))].sort();

/** 하위 호환 */
export const buildDeaths = (bundles: SessionBundle[]) =>
	buildStages(bundles).map((s) => ({
		stage: s.stage,
		deaths: s.deaths,
		sessionsEntered: s.reach,
		deathsPerSession: s.deathsPerSession,
		topCause: '-'
	}));
