<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		buildCauseBreakdown,
		buildCheckpointReach,
		buildCombat,
		buildCompare,
		buildDeathPoints,
		buildFunnel,
		buildItems,
		buildNarrative,
		buildOverview,
		buildQuality,
		buildSessionRows,
		buildStages,
		buildSurveyStats,
		collectBuildVersions,
		discoverStages,
		filterSessions,
		sessionDurationS,
		type SessionBundle
	} from '$lib/analyze/aggregate';
	import { loadPlaytestBundles } from '$lib/analyze/load';
	import type { AnalyzeFilters, AnalyzeTab, AnalyticsEvent, SurveyResponse } from '$lib/analyze/types';
	import LoadingBar from '$lib/sources/LoadingBar.svelte';

	const ADMIN_KEY = 'dami-admin-unlocked-v1';
	const TABS: { id: AnalyzeTab; label: string }[] = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'funnel', label: 'Funnel' },
		{ id: 'stages', label: 'Stages' },
		{ id: 'combat', label: 'Combat' },
		{ id: 'items', label: 'Items' },
		{ id: 'narrative', label: 'Narrative' },
		{ id: 'quality', label: 'Quality' },
		{ id: 'sessions', label: 'Sessions' },
		{ id: 'survey', label: 'Survey' },
		{ id: 'compare', label: 'Compare' }
	];

	let authorized = false;
	let loading = true;
	let loadError = '';
	let progress = '';
	let allBundles: SessionBundle[] = [];
	let surveys: SurveyResponse[] = [];
	let lastUpdatedAt = '';
	let section: AnalyzeTab = 'overview';
	let urlReady = false;

	let excludeEditor = true;
	let minDurationS = 60;
	let selectedBuilds: string[] = [];
	let availableBuilds: string[] = [];
	let fromMs: number | null = Date.now() - 14 * 24 * 60 * 60 * 1000;
	let toMs: number | null = null;
	let stageFilter = '';
	let deathStageFilter = '';
	let selectedSessionId = '';
	let sessionQuery = '';
	let compareA = '';
	let compareB = '';
	let eventJson: AnalyticsEvent | null = null;

	$: filters = {
		builds: selectedBuilds,
		excludeEditor,
		minDurationS,
		fromMs,
		toMs,
		stage: stageFilter
	} satisfies AnalyzeFilters;

	$: filtered = filterSessions(allBundles, filters);
	$: stageOrder = discoverStages(filtered);
	$: overview = buildOverview(filtered, surveys, stageOrder);
	$: surveyJoined = (() => {
		const matched = surveys.filter((s) => filtered.some((b) => b.meta.sessionId === s.sessionId));
		if (matched.length) return matched;
		return surveys.filter(
			(s) => !selectedBuilds.length || !s.build || selectedBuilds.includes(s.build)
		);
	})();
	$: funnel = buildFunnel(filtered, stageOrder, surveyJoined.length);
	$: stages = buildStages(filtered, stageOrder);
	$: causes = buildCauseBreakdown(filtered, deathStageFilter || stageFilter);
	$: checkpoints = buildCheckpointReach(filtered, deathStageFilter || stageFilter);
	$: scatter = buildDeathPoints(filtered, deathStageFilter || stageFilter);
	$: combat = buildCombat(filtered);
	$: items = buildItems(filtered);
	$: narrative = buildNarrative(filtered);
	$: quality = buildQuality(filtered);
	$: sessions = buildSessionRows(filtered).filter((row) => {
		if (!sessionQuery.trim()) return true;
		const q = sessionQuery.trim().toLowerCase();
		return (
			row.sessionId.toLowerCase() === q ||
			row.sessionId.toLowerCase().startsWith(q) ||
			row.deviceId.toLowerCase().startsWith(q)
		);
	});
	$: surveyStats = buildSurveyStats(filtered, surveyJoined);
	$: compare =
		compareA && compareB
			? buildCompare(allBundles, compareA, compareB, {
					...filters,
					builds: [],
					stage: ''
				})
			: null;
	$: selectedBundle = filtered.find((b) => b.meta.sessionId === selectedSessionId) || null;
	$: timeline = selectedBundle
		? [...selectedBundle.events].sort((a, b) => (a.timestamp_ms || 0) - (b.timestamp_ms || 0))
		: [];
	$: mapPoints = selectedBundle
		? selectedBundle.events
				.filter(
					(e) =>
						(e.event === 'player_death' ||
							e.event === 'checkpoint_reached' ||
							e.event === 'item_use') &&
						typeof e.x === 'number' &&
						typeof e.z === 'number'
				)
				.map((e) => ({
					x: e.x as number,
					z: e.z as number,
					kind: e.event,
					label: String(e.cause || e.restore_key || e.item_id || e.event)
				}))
		: [];

	const pct = (n: number | null | undefined, digits = 0) =>
		n == null || !Number.isFinite(n) ? '-' : `${(n * 100).toFixed(digits)}%`;
	const fmtDur = (s: number | null | undefined) => {
		if (s == null || !Number.isFinite(s) || s < 0) return '-';
		const m = Math.floor(s / 60);
		const sec = Math.round(s % 60);
		return `${m}:${String(sec).padStart(2, '0')}`;
	};
	const fmtNum = (n: number | null | undefined, digits = 2) =>
		n == null || !Number.isFinite(n) ? '-' : n.toFixed(digits);
	const nLabel = (n: number) => `n=${n}`;

	const eventLabel = (e: AnalyticsEvent) => {
		const extra: string[] = [];
		if (e.stage || e.stage_name) extra.push(String(e.stage || e.stage_name));
		if (e.reason) extra.push(`reason=${e.reason}`);
		if (e.cause) extra.push(`cause=${e.cause}`);
		if (e.enemy_type) extra.push(String(e.enemy_type));
		if (e.item_id) extra.push(String(e.item_id));
		if (e.node_id) extra.push(String(e.node_id));
		return extra.length ? `${e.event} · ${extra.join(' · ')}` : e.event;
	};

	const parseQuery = () => {
		const q = $page.url.searchParams;
		const tab = q.get('tab') as AnalyzeTab | null;
		if (tab && TABS.some((t) => t.id === tab)) section = tab;
		if (q.has('excludeEditor')) excludeEditor = q.get('excludeEditor') !== '0';
		if (q.has('minDuration')) minDurationS = Number(q.get('minDuration')) || 0;
		if (q.has('stage')) stageFilter = q.get('stage') || '';
		if (q.has('from')) {
			const v = q.get('from')!;
			fromMs = /^\d+$/.test(v) ? Number(v) : Date.parse(v);
			if (!Number.isFinite(fromMs)) fromMs = null;
		}
		if (q.has('to')) {
			const v = q.get('to')!;
			toMs = /^\d+$/.test(v) ? Number(v) : Date.parse(v);
			if (!Number.isFinite(toMs)) toMs = null;
		}
		if (q.has('build')) {
			selectedBuilds = (q.get('build') || '')
				.split(',')
				.map((s) => s.trim())
				.filter(Boolean);
		}
		if (q.has('q')) sessionQuery = q.get('q') || '';
		if (q.has('session')) selectedSessionId = q.get('session') || '';
		if (q.has('compareA')) compareA = q.get('compareA') || '';
		if (q.has('compareB')) compareB = q.get('compareB') || '';
	};

	const syncQuery = () => {
		if (!urlReady || !authorized) return;
		const params = new URLSearchParams();
		if (section !== 'overview') params.set('tab', section);
		if (selectedBuilds.length && selectedBuilds.length < availableBuilds.length) {
			params.set('build', selectedBuilds.join(','));
		}
		if (fromMs != null) params.set('from', String(fromMs));
		if (toMs != null) params.set('to', String(toMs));
		if (!excludeEditor) params.set('excludeEditor', '0');
		if (minDurationS !== 60) params.set('minDuration', String(minDurationS));
		if (stageFilter) params.set('stage', stageFilter);
		if (sessionQuery) params.set('q', sessionQuery);
		if (selectedSessionId) params.set('session', selectedSessionId);
		if (compareA) params.set('compareA', compareA);
		if (compareB) params.set('compareB', compareB);
		const qs = params.toString();
		const next = `/dami/analyze${qs ? `?${qs}` : ''}`;
		if (`${$page.url.pathname}${$page.url.search}` !== next) {
			goto(next, { replaceState: true, keepFocus: true, noScroll: true });
		}
	};

	$: if (urlReady) {
		section;
		selectedBuilds;
		excludeEditor;
		minDurationS;
		fromMs;
		toMs;
		stageFilter;
		sessionQuery;
		selectedSessionId;
		compareA;
		compareB;
		syncQuery();
	}

	onMount(async () => {
		if (sessionStorage.getItem(ADMIN_KEY) !== '1') {
			goto('/dami');
			return;
		}
		authorized = true;
		parseQuery();
		try {
			const result = await loadPlaytestBundles((done, total) => {
				progress = total ? `세션 로딩 ${done}/${total}` : '';
			});
			allBundles = result.bundles;
			surveys = result.surveys;
			lastUpdatedAt = result.lastUpdatedAt;
			availableBuilds = collectBuildVersions(allBundles.map((b) => b.meta));
			if (!selectedBuilds.length) {
				selectedBuilds = availableBuilds.filter((b) => !/\+editor|editor-ping|-e2e/i.test(b));
				if (!selectedBuilds.length) selectedBuilds = [...availableBuilds];
			}
			if (!compareA && availableBuilds[0]) compareA = availableBuilds[0];
			if (!compareB && availableBuilds[1]) compareB = availableBuilds[1];
			else if (!compareB && availableBuilds[0]) compareB = availableBuilds[0];
			const initialStages = buildStages(
				filterSessions(allBundles, {
					builds: selectedBuilds,
					excludeEditor,
					minDurationS,
					fromMs,
					toMs,
					stage: ''
				})
			);
			if (!deathStageFilter && initialStages.length) deathStageFilter = initialStages[0].stage;
			const probe = filterSessions(allBundles, {
				builds: selectedBuilds,
				excludeEditor,
				minDurationS,
				fromMs,
				toMs,
				stage: ''
			});
			if (!probe.length && allBundles.length) {
				// 최근 14일에 데이터가 없으면 전체 기간으로 완화
				fromMs = null;
				toMs = null;
			}
		} catch (err) {
			console.error(err);
			loadError = err instanceof Error ? err.message : String(err);
		} finally {
			loading = false;
			progress = '';
			urlReady = true;
		}
	});

	const toggleBuild = (build: string) => {
		if (selectedBuilds.includes(build)) {
			selectedBuilds = selectedBuilds.filter((b) => b !== build);
		} else {
			selectedBuilds = [...selectedBuilds, build];
		}
	};

	const goSessions = (extra: { q?: string; stage?: string } = {}) => {
		section = 'sessions';
		if (extra.q) sessionQuery = extra.q;
		if (extra.stage != null) stageFilter = extra.stage;
	};

	const setRangeDays = (days: number | null) => {
		if (days == null) {
			fromMs = null;
			toMs = null;
			return;
		}
		fromMs = Date.now() - days * 24 * 60 * 60 * 1000;
		toMs = null;
	};

	$: maxFunnel = Math.max(1, ...(funnel ?? []).map((s) => s.count));
	$: maxDay = Math.max(1, ...(overview?.sessionsByDay ?? []).map((d) => d.count));
	$: maxBar = (vals: number[]) => Math.max(1, ...vals);

	$: scatterBounds = (() => {
		const pts = scatter?.length ? scatter : mapPoints;
		if (!pts?.length) return { minX: 0, maxX: 1, minZ: 0, maxZ: 1 };
		const xs = pts.map((p) => p.x);
		const zs = pts.map((p) => p.z);
		return {
			minX: Math.min(...xs),
			maxX: Math.max(...xs),
			minZ: Math.min(...zs),
			maxZ: Math.max(...zs)
		};
	})();

	const downloadJsonl = () => {
		if (!selectedBundle) return;
		const blob = new Blob(
			[selectedBundle.events.map((e) => JSON.stringify(e)).join('\n') + '\n'],
			{ type: 'application/x-ndjson' }
		);
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = `${selectedBundle.meta.sessionId}.jsonl`;
		a.click();
		URL.revokeObjectURL(a.href);
	};
</script>

<svelte:head>
	<title>Analyze · DAMI</title>
</svelte:head>

{#if authorized}
	<div class="analyze">
		<header class="top">
			<div>
				<p class="eyebrow">Internal · playtest</p>
				<h1>DAMI Analyze</h1>
				<p class="lead">
					세션 JSONL + 설문 조인 · 퍼널·난이도·전투·아이템·품질
					{#if lastUpdatedAt}
						<span class="health"> · last ingest {lastUpdatedAt}</span>
					{/if}
					<span class="health"> · {nLabel(filtered.length)}</span>
				</p>
			</div>
			{#if progress}
				<p class="progressive">{progress}</p>
			{/if}
		</header>

		{#if loading}
			<LoadingBar label="플레이테스트 세션 불러오는 중" />
		{:else if loadError}
			<p class="error">{loadError}</p>
		{:else}
			<section class="filters">
				<div class="filter-block">
					<p class="filter-label">Build version</p>
					<div class="chips">
						{#each availableBuilds as build}
							<button
								type="button"
								class="chip"
								class:on={selectedBuilds.includes(build)}
								on:click={() => toggleBuild(build)}
							>
								<code>{build}</code>
							</button>
						{/each}
						{#if !availableBuilds.length}
							<span class="muted">업로드된 빌드 없음</span>
						{/if}
					</div>
				</div>
				<div class="filter-block">
					<p class="filter-label">기간</p>
					<div class="chips">
						<button type="button" class="chip" class:on={fromMs != null && Date.now() - fromMs < 15 * 86400000} on:click={() => setRangeDays(14)}>14일</button>
						<button type="button" class="chip" class:on={fromMs != null && Date.now() - fromMs >= 15 * 86400000 && Date.now() - fromMs < 35 * 86400000} on:click={() => setRangeDays(30)}>30일</button>
						<button type="button" class="chip" class:on={fromMs == null && toMs == null} on:click={() => setRangeDays(null)}>전체</button>
					</div>
				</div>
				<label class="check">
					<input type="checkbox" bind:checked={excludeEditor} />
					<span>+editor / e2e 제외</span>
				</label>
				<label class="num">
					<span>최소 세션 길이(초)</span>
					<input type="number" min="0" step="10" bind:value={minDurationS} />
				</label>
				<label class="num">
					<span>Stage</span>
					<select bind:value={stageFilter}>
						<option value="">All</option>
						{#each stageOrder as st}
							<option value={st}>{st}</option>
						{/each}
					</select>
				</label>
			</section>

			{#if !filtered.length}
				<p class="empty">필터에 맞는 세션이 없습니다. 기간·최소 길이(기본 60s)·빌드를 확인하세요.</p>
			{:else}
				<nav class="tabs">
					{#each TABS as t}
						<button type="button" class:active={section === t.id} on:click={() => (section = t.id)}
							>{t.label}</button
						>
					{/each}
				</nav>

				{#if section === 'overview'}
					<div class="stats">
						<div class="stat"><span>Sessions</span><strong>{overview.sessions}</strong><em>{nLabel(overview.sessions)}</em></div>
						<div class="stat"><span>Median duration</span><strong>{fmtDur(overview.medianDurationS)}</strong></div>
						<div class="stat"><span>Demo start</span><strong>{pct(overview.demoStartRate)}</strong><em>{nLabel(overview.n.demoStarts)}</em></div>
						<div class="stat"><span>Clear rate</span><strong>{pct(overview.clearRate)}</strong><em>{nLabel(overview.n.clears)}</em></div>
						<div class="stat"><span>Median hit rate</span><strong>{pct(overview.medianHitRate)}</strong><em>{nLabel(overview.n.hitRateSamples)}</em></div>
						<div class="stat"><span>Survey response</span><strong>{pct(overview.surveyResponseRate)}</strong><em>{nLabel(overview.n.surveyResponses)}/{overview.n.surveyShown}</em></div>
						<div class="stat"><span>Error sessions</span><strong>{pct(overview.errorSessionRate)}</strong><em>{nLabel(overview.n.errorSessions)}</em></div>
						<div class="stat"><span>Median FPS</span><strong>{overview.medianFps == null ? '-' : overview.medianFps.toFixed(1)}</strong><em>{nLabel(overview.n.fpsSamples)}</em></div>
					</div>

					<div class="grid-2">
						<div class="panel">
							<p class="panel-title">일별 세션</p>
							{#each overview.sessionsByDay as row}
								<div class="bar-row">
									<span class="bar-label">{row.day}</span>
									<div class="bar-track">
										<div class="bar-fill" style="width: {(row.count / maxDay) * 100}%"></div>
									</div>
									<span class="bar-val">{row.count}<small>d{row.deaths}</small></span>
								</div>
							{/each}
						</div>
						<div class="panel">
							<p class="panel-title">빌드별 세션</p>
							{#each overview.sessionsByBuild as row}
								<div class="bar-row">
									<span class="bar-label mono">{row.build}</span>
									<div class="bar-track">
										<div class="bar-fill" style="width: {(row.count / Math.max(1, overview.sessions)) * 100}%"></div>
									</div>
									<span class="bar-val">{row.count}</span>
								</div>
							{/each}
						</div>
					</div>

					<div class="grid-2">
						<div class="panel">
							<p class="panel-title">종료 사유</p>
							{#each overview.endReasons as row}
								<div class="bar-row">
									<span class="bar-label mono">{row.reason}</span>
									<div class="bar-track">
										<div class="bar-fill" style="width: {(row.count / maxBar(overview.endReasons.map((r) => r.count))) * 100}%"></div>
									</div>
									<span class="bar-val">{row.count}</span>
								</div>
							{:else}
								<p class="muted">session_end 없음</p>
							{/each}
						</div>
						<div class="panel">
							<p class="panel-title">Top 이슈</p>
							<table>
								<tbody>
									{#each overview.topIssues as row}
										<tr class="clickable" on:click={() => goSessions()}>
											<td><code>{row.kind}</code></td>
											<td>{row.label}</td>
											<td>{row.count}</td>
										</tr>
									{:else}
										<tr><td colspan="3" class="muted">이슈 없음</td></tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				{:else if section === 'funnel'}
					<div class="panel">
						<p class="panel-title">세션 퍼널</p>
						{#each funnel as step}
							<button type="button" class="funnel-row clickable-row" on:click={() => goSessions()}>
								<div class="funnel-meta">
									<code>{step.label}</code>
									<span>{step.count} · {pct(step.rate)} · drop {step.dropAbs}</span>
								</div>
								<div class="bar-track tall">
									<div class="bar-fill" style="width: {(step.count / maxFunnel) * 100}%"></div>
								</div>
							</button>
						{/each}
					</div>
					<div class="panel">
						<p class="panel-title">단계별 드롭</p>
						{#each funnel.filter((s) => s.dropAbs > 0) as step}
							<div class="bar-row">
								<span class="bar-label mono">{step.label}</span>
								<div class="bar-track">
									<div class="bar-fill danger" style="width: {(step.dropAbs / maxFunnel) * 100}%"></div>
								</div>
								<span class="bar-val">{step.dropAbs}</span>
							</div>
						{:else}
							<p class="muted">드롭 데이터 없음</p>
						{/each}
					</div>
				{:else if section === 'stages'}
					<div class="panel">
						<p class="panel-title">스테이지 비교</p>
						<table>
							<thead>
								<tr>
									<th>stage</th>
									<th>reach</th>
									<th>clear%</th>
									<th>med dur</th>
									<th>p90</th>
									<th>deaths/s</th>
									<th>hit%</th>
									<th>items/s</th>
								</tr>
							</thead>
							<tbody>
								{#each stages as row}
									<tr
										class="clickable"
										class:active={deathStageFilter === row.stage}
										on:click={() => {
											deathStageFilter = row.stage;
											stageFilter = row.stage;
										}}
									>
										<td><code>{row.stage}</code></td>
										<td>{row.reach}</td>
										<td>{pct(row.clearRate)}</td>
										<td>{fmtDur(row.medianDurationS)}</td>
										<td>{fmtDur(row.p90DurationS)}</td>
										<td>{fmtNum(row.deathsPerSession)}</td>
										<td>{pct(row.medianHitRate)}</td>
										<td>{fmtNum(row.itemUsesPerSession, 1)}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<div class="grid-2">
						<div class="panel">
							<p class="panel-title">사망 vs 클리어</p>
							{#each stages as row}
								<div class="dual">
									<span class="bar-label mono">{row.stage}</span>
									<div class="dual-bars">
										<div class="mini danger" style="width: {(row.deaths / maxBar(stages.map((s) => s.deaths || 1))) * 100}%"></div>
										<div class="mini ok" style="width: {(row.clears / maxBar(stages.map((s) => s.clears || 1))) * 100}%"></div>
									</div>
									<span class="bar-val">{row.deaths}/{row.clears}</span>
								</div>
							{/each}
						</div>
						<div class="panel">
							<p class="panel-title">사망 원인 · {deathStageFilter || 'all'}</p>
							<select bind:value={deathStageFilter}>
								<option value="">전체</option>
								{#each stageOrder as st}
									<option value={st}>{st}</option>
								{/each}
							</select>
							{#each causes as row}
								<div class="bar-row">
									<span class="bar-label mono">{row.cause}</span>
									<div class="bar-track">
										<div class="bar-fill" style="width: {(row.count / maxBar(causes.map((c) => c.count))) * 100}%"></div>
									</div>
									<span class="bar-val">{row.count}</span>
								</div>
							{:else}
								<p class="muted">사망 없음</p>
							{/each}
						</div>
					</div>

					<div class="panel scatter-panel">
						<p class="panel-title">사망 히트맵 (x/z) · {deathStageFilter || 'select stage'}</p>
						{#if scatter.length}
							<svg class="scatter" viewBox="0 0 100 100" preserveAspectRatio="none">
								{#each scatter as p}
									{@const nx =
										((p.x - scatterBounds.minX) /
											Math.max(1e-6, scatterBounds.maxX - scatterBounds.minX)) *
										100}
									{@const nz =
										((p.z - scatterBounds.minZ) /
											Math.max(1e-6, scatterBounds.maxZ - scatterBounds.minZ)) *
										100}
									<circle cx={nx} cy={100 - nz} r="1.4" fill="currentColor" opacity="0.75" />
								{/each}
							</svg>
							<p class="muted">{scatter.length} points</p>
						{:else}
							<p class="muted">좌표가 있는 사망 이벤트가 없습니다. 스테이지를 선택하세요.</p>
						{/if}
					</div>

					<div class="panel">
						<p class="panel-title">체크포인트 도달</p>
						{#each checkpoints as row}
							<div class="bar-row">
								<span class="bar-label mono">{row.key}</span>
								<div class="bar-track">
									<div class="bar-fill" style="width: {(row.count / maxBar(checkpoints.map((c) => c.count))) * 100}%"></div>
								</div>
								<span class="bar-val">{row.count}</span>
							</div>
						{:else}
							<p class="muted">checkpoint_reached 없음</p>
						{/each}
					</div>
				{:else if section === 'combat'}
					<p class="hint">공식 KPI는 attack_swing 대비 hit_dealt 및 *_summary 우선. hit_*는 클라이언트 스로틀로 under-count 가능.</p>
					<div class="stats">
						<div class="stat"><span>Median hit rate</span><strong>{pct(combat.medianHitRate)}</strong><em>{nLabel(combat.n.sessionsWithCombat)}</em></div>
						<div class="stat"><span>Normal</span><strong>{pct(combat.medianNormalHitRate)}</strong></div>
						<div class="stat"><span>Special</span><strong>{pct(combat.medianSpecialHitRate)}</strong></div>
						<div class="stat"><span>Swings / min</span><strong>{fmtNum(combat.swingsPerMinute, 1)}</strong><em>{nLabel(combat.n.swings)}</em></div>
						<div class="stat"><span>Absorbs / session</span><strong>{fmtNum(combat.absorbsPerSession, 2)}</strong></div>
						<div class="stat"><span>Hit taken / min</span><strong>{fmtNum(combat.hitTakenPerMinute, 2)}</strong></div>
					</div>
					<div class="grid-2">
						<div class="panel">
							<p class="panel-title">명중률 분포</p>
							{#each combat.hitRateHist as row}
								<div class="bar-row">
									<span class="bar-label">{row.bucket}</span>
									<div class="bar-track">
										<div class="bar-fill" style="width: {(row.count / maxBar(combat.hitRateHist.map((h) => h.count))) * 100}%"></div>
									</div>
									<span class="bar-val">{row.count}</span>
								</div>
							{/each}
						</div>
						<div class="panel">
							<p class="panel-title">스테이지별 명중률</p>
							{#each combat.byStage as row}
								<div class="bar-row">
									<span class="bar-label mono">{row.stage}</span>
									<div class="bar-track">
										<div class="bar-fill" style="width: {((row.medianHitRate || 0) * 100)}%"></div>
									</div>
									<span class="bar-val">{pct(row.medianHitRate)} <small>{nLabel(row.n)}</small></span>
								</div>
							{:else}
								<p class="muted">stage_summary 명중률 없음</p>
							{/each}
						</div>
					</div>
					<div class="grid-2">
						<div class="panel">
							<p class="panel-title">Kill mix</p>
							{#each combat.killMix as row}
								<div class="bar-row">
									<span class="bar-label mono">{row.enemy}</span>
									<div class="bar-track">
										<div class="bar-fill" style="width: {(row.count / maxBar(combat.killMix.map((k) => k.count))) * 100}%"></div>
									</div>
									<span class="bar-val">{row.count}</span>
								</div>
							{:else}
								<p class="muted">enemy_kill 없음</p>
							{/each}
						</div>
						<div class="panel">
							<p class="panel-title">Hit taken sources</p>
							{#each combat.hitTakenSources as row}
								<div class="bar-row">
									<span class="bar-label mono">{row.source}</span>
									<div class="bar-track">
										<div class="bar-fill" style="width: {(row.count / maxBar(combat.hitTakenSources.map((k) => k.count))) * 100}%"></div>
									</div>
									<span class="bar-val">{row.count}</span>
								</div>
							{:else}
								<p class="muted">hit_taken 없음</p>
							{/each}
						</div>
					</div>
					<div class="grid-2">
						<div class="panel">
							<p class="panel-title">Weapon mode</p>
							{#each combat.weaponModes as row}
								<div class="bar-row">
									<span class="bar-label mono">{row.mode}</span>
									<div class="bar-track">
										<div class="bar-fill" style="width: {(row.count / maxBar(combat.weaponModes.map((k) => k.count))) * 100}%"></div>
									</div>
									<span class="bar-val">{row.count}</span>
								</div>
							{:else}
								<p class="muted">attack_swing 없음</p>
							{/each}
						</div>
						<div class="panel">
							<p class="panel-title">Absorb by stage</p>
							{#each combat.absorbsByStage as row}
								<div class="bar-row">
									<span class="bar-label mono">{row.stage}</span>
									<div class="bar-track">
										<div class="bar-fill" style="width: {(row.count / maxBar(combat.absorbsByStage.map((k) => k.count))) * 100}%"></div>
									</div>
									<span class="bar-val">{row.count}</span>
								</div>
							{:else}
								<p class="muted">absorb 없음</p>
							{/each}
						</div>
					</div>
				{:else if section === 'items'}
					<div class="stats">
						<div class="stat"><span>Total uses</span><strong>{items.n.totalUses}</strong></div>
						<div class="stat"><span>Sessions w/ item</span><strong>{items.n.sessionsWithItem}</strong></div>
						<div class="stat"><span>Death-60s bandage</span><strong>{pct(items.nearDeathBandageRate)}</strong></div>
					</div>
					<div class="chips preset">
						<button type="button" class="chip" on:click={() => goSessions()}>사망 세션 보기</button>
					</div>
					<div class="grid-2">
						<div class="panel">
							<p class="panel-title">아이템별 사용</p>
							{#each items.byItem as row}
								<div class="bar-row">
									<span class="bar-label mono">{row.itemId}</span>
									<div class="bar-track">
										<div class="bar-fill" style="width: {(row.count / maxBar(items.byItem.map((i) => i.count))) * 100}%"></div>
									</div>
									<span class="bar-val">{row.count} <small>×{fmtNum(row.meanUses, 1)}</small></span>
								</div>
							{:else}
								<p class="muted">item_use 없음</p>
							{/each}
						</div>
						<div class="panel">
							<p class="panel-title">Reason</p>
							{#each items.reasons as row}
								<div class="bar-row">
									<span class="bar-label mono">{row.reason}</span>
									<div class="bar-track">
										<div class="bar-fill" style="width: {(row.count / maxBar(items.reasons.map((i) => i.count))) * 100}%"></div>
									</div>
									<span class="bar-val">{row.count}</span>
								</div>
							{:else}
								<p class="muted">reason 없음</p>
							{/each}
						</div>
					</div>
					<div class="grid-2">
						<div class="panel">
							<p class="panel-title">세션당 사용 분포</p>
							{#each items.usesHist as row}
								<div class="bar-row">
									<span class="bar-label">{row.bucket}</span>
									<div class="bar-track">
										<div class="bar-fill" style="width: {(row.count / maxBar(items.usesHist.map((i) => i.count))) * 100}%"></div>
									</div>
									<span class="bar-val">{row.count}</span>
								</div>
							{/each}
						</div>
						<div class="panel">
							<p class="panel-title">첫 사용 시점 (median realtime_s)</p>
							{#each items.firstUse as row}
								<div class="bar-row">
									<span class="bar-label mono">{row.itemId}</span>
									<span class="bar-val">{fmtNum(row.medianRealtimeS, 1)}s <small>{nLabel(row.n)}</small></span>
								</div>
							{:else}
								<p class="muted">데이터 없음</p>
							{/each}
						</div>
					</div>
					<div class="panel">
						<p class="panel-title">스테이지 × 아이템</p>
						<table>
							<thead><tr><th>stage</th><th>item</th><th>count</th></tr></thead>
							<tbody>
								{#each items.byStage.slice(0, 40) as row}
									<tr><td><code>{row.stage}</code></td><td><code>{row.itemId}</code></td><td>{row.count}</td></tr>
								{:else}
									<tr><td colspan="3" class="muted">없음</td></tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else if section === 'narrative'}
					<div class="grid-2">
						<div class="panel">
							<p class="panel-title">Dialogue starts</p>
							{#each narrative.dialogueStarts as row}
								<div class="bar-row">
									<span class="bar-label mono">{row.nodeId}</span>
									<div class="bar-track">
										<div class="bar-fill" style="width: {(row.count / maxBar(narrative.dialogueStarts.map((d) => d.count))) * 100}%"></div>
									</div>
									<span class="bar-val">{row.count}</span>
								</div>
							{:else}
								<p class="muted">dialogue_start 없음</p>
							{/each}
						</div>
						<div class="panel">
							<p class="panel-title">Choices</p>
							{#each narrative.choices as row}
								<div class="bar-row">
									<span class="bar-label mono">{row.label || row.choiceId}</span>
									<div class="bar-track">
										<div class="bar-fill" style="width: {(row.count / maxBar(narrative.choices.map((d) => d.count))) * 100}%"></div>
									</div>
									<span class="bar-val">{row.count}</span>
								</div>
							{:else}
								<p class="muted">dialogue_choice 없음</p>
							{/each}
						</div>
					</div>
					<div class="panel">
						<p class="panel-title">Tutorial funnel</p>
						<table>
							<thead><tr><th>id</th><th>shown</th><th>completed</th><th>incomplete</th></tr></thead>
							<tbody>
								{#each narrative.tutorial as row}
									<tr>
										<td><code>{row.id}</code></td>
										<td>{row.shown}</td>
										<td>{row.completed}</td>
										<td>{row.incomplete}</td>
									</tr>
								{:else}
									<tr><td colspan="4" class="muted">tutorial_step 없음</td></tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else if section === 'quality'}
					<div class="stats">
						<div class="stat"><span>Perf samples</span><strong>{quality.n.samples}</strong></div>
						<div class="stat"><span>Hitch p95</span><strong>{quality.hitchP95 == null ? '-' : `${quality.hitchP95.toFixed(1)}ms`}</strong></div>
						<div class="stat"><span>Error events</span><strong>{quality.n.errorEvents}</strong></div>
					</div>
					<div class="grid-2">
						<div class="panel">
							<p class="panel-title">FPS by day</p>
							{#each quality.fpsByDay as row}
								<div class="bar-row">
									<span class="bar-label">{row.day}</span>
									<div class="bar-track">
										<div class="bar-fill" style="width: {Math.min(100, (row.avgFps / 60) * 100)}%"></div>
									</div>
									<span class="bar-val">{row.avgFps.toFixed(1)} <small>{nLabel(row.n)}</small></span>
								</div>
							{:else}
								<p class="muted">perf_sample 없음</p>
							{/each}
						</div>
						<div class="panel">
							<p class="panel-title">FPS by stage</p>
							{#each quality.fpsByStage as row}
								<div class="bar-row">
									<span class="bar-label mono">{row.stage}</span>
									<div class="bar-track">
										<div class="bar-fill" style="width: {Math.min(100, (row.medianFps / 60) * 100)}%"></div>
									</div>
									<span class="bar-val">{row.medianFps.toFixed(1)}</span>
								</div>
							{:else}
								<p class="muted">없음</p>
							{/each}
						</div>
					</div>
					<div class="panel">
						<p class="panel-title">Errors</p>
						<table>
							<thead><tr><th>message</th><th>count</th><th>sessions</th></tr></thead>
							<tbody>
								{#each quality.errors as row}
									<tr class="clickable" on:click={() => goSessions()}>
										<td class="wrap">{row.message}</td>
										<td>{row.count}</td>
										<td>{row.sessions}</td>
									</tr>
								{:else}
									<tr><td colspan="3" class="muted">error 없음</td></tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else if section === 'sessions'}
					<div class="session-tools">
						<input type="search" placeholder="session_id exact / device_id prefix" bind:value={sessionQuery} />
					</div>
					<div class="panel">
						<p class="panel-title">세션 목록</p>
						<table>
							<thead>
								<tr>
									<th>session</th>
									<th>build</th>
									<th>dur</th>
									<th>stages</th>
									<th>deaths</th>
									<th>hit%</th>
									<th>items</th>
									<th>survey</th>
									<th>err</th>
								</tr>
							</thead>
							<tbody>
								{#each sessions as row}
									<tr
										class:active={selectedSessionId === row.sessionId}
										class="clickable"
										on:click={() => (selectedSessionId = row.sessionId)}
									>
										<td><code>{row.sessionId.slice(0, 10)}…</code></td>
										<td><code>{row.buildVersion}</code></td>
										<td>{fmtDur(row.durationS)}</td>
										<td><code>{row.stagesReached.join(',') || '-'}</code></td>
										<td>{row.deaths}</td>
										<td>{pct(row.hitRate)}</td>
										<td>{row.itemUses}</td>
										<td>{row.hasSurvey ? 'Y' : '-'}</td>
										<td>{row.hasError ? '!' : '-'}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					{#if selectedBundle}
						<div class="panel">
							<div class="session-head">
								<p class="panel-title">
									상세 · <code>{selectedBundle.meta.sessionId}</code>
								</p>
								<button type="button" class="chip" on:click={downloadJsonl}>JSONL 다운로드</button>
							</div>
							<div class="stats compact">
								<div class="stat"><span>duration</span><strong>{fmtDur(sessionDurationS(selectedBundle.events, selectedBundle.meta))}</strong></div>
								<div class="stat"><span>deaths</span><strong>{selectedBundle.events.filter((e) => e.event === 'player_death').length}</strong></div>
								<div class="stat"><span>items</span><strong>{selectedBundle.events.filter((e) => e.event === 'item_use').length}</strong></div>
								<div class="stat"><span>events</span><strong>{selectedBundle.events.length}</strong></div>
							</div>
							{#if selectedBundle.survey}
								<div class="survey-box">
									<p class="panel-title">설문 응답</p>
									<pre>{JSON.stringify(selectedBundle.survey.answers, null, 2)}</pre>
									{#if selectedBundle.survey.freeText}
										<p>{selectedBundle.survey.freeText}</p>
									{/if}
								</div>
							{/if}
							{#if mapPoints.length}
								<svg class="scatter" viewBox="0 0 100 100" preserveAspectRatio="none">
									{#each mapPoints as p}
										{@const nx =
											((p.x - scatterBounds.minX) /
												Math.max(1e-6, scatterBounds.maxX - scatterBounds.minX)) *
											100}
										{@const nz =
											((p.z - scatterBounds.minZ) /
												Math.max(1e-6, scatterBounds.maxZ - scatterBounds.minZ)) *
											100}
										<circle
											cx={nx}
											cy={100 - nz}
											r="1.6"
											fill={p.kind === 'player_death' ? '#b00020' : p.kind === 'item_use' ? '#2f6f4e' : 'currentColor'}
											opacity="0.8"
										/>
									{/each}
								</svg>
							{/if}
							<ul class="timeline">
								{#each timeline as e}
									<li>
										<button type="button" class="tl-btn" on:click={() => (eventJson = e)}>
											<span class="t">
												{e.timestamp_ms ? new Date(e.timestamp_ms).toLocaleTimeString('ko-KR') : '-'}
											</span>
											<code>{eventLabel(e)}</code>
										</button>
									</li>
								{/each}
							</ul>
							{#if eventJson}
								<pre class="json">{JSON.stringify(eventJson, null, 2)}</pre>
							{/if}
						</div>
					{/if}
				{:else if section === 'survey'}
					<div class="stats">
						<div class="stat"><span>Link shown</span><strong>{surveyStats.shown}</strong><em>survey_link_shown</em></div>
						<div class="stat"><span>Submitted</span><strong>{surveyStats.submitted}</strong></div>
						<div class="stat"><span>Response rate</span><strong>{pct(surveyStats.responseRate)}</strong></div>
						{#each surveyStats.likertAverages as row}
							<div class="stat">
								<span>{row.label} avg</span>
								<strong>{row.avg == null ? '-' : row.avg.toFixed(2)}</strong>
								<em>{nLabel(row.n)}</em>
							</div>
						{/each}
					</div>
					{#if !surveyStats.submitted}
						<p class="empty">
							설문 응답이 없습니다. 플레이어가
							<code>/dami/survey?session_id=…&build=…</code>
							에서 제출하면 여기에 조인됩니다.
						</p>
					{:else}
						<div class="grid-2">
							{#each surveyStats.byQuestion as q}
								<div class="panel">
									<p class="panel-title">{q.label}</p>
									{#each q.values as row}
										<div class="bar-row">
											<span class="bar-label">{row.value}</span>
											<div class="bar-track">
												<div
													class="bar-fill"
													style="width: {(row.count / maxBar(q.values.map((v) => v.count))) * 100}%"
												></div>
											</div>
											<span class="bar-val">{row.count}</span>
										</div>
									{/each}
								</div>
							{/each}
						</div>

						<div class="panel">
							<p class="panel-title">가장 부족한 부분</p>
							{#each surveyStats.lacking as row}
								<div class="bar-row">
									<span class="bar-label">{row.value}</span>
									<div class="bar-track">
										<div
											class="bar-fill"
											style="width: {(row.count / maxBar(surveyStats.lacking.map((v) => v.count))) * 100}%"
										></div>
									</div>
									<span class="bar-val">{row.count}</span>
								</div>
							{:else}
								<p class="muted">응답 없음</p>
							{/each}
						</div>

						<div class="panel">
							<p class="panel-title">정성 × 정량 교차</p>
							<table>
								<thead>
									<tr>
										<th>session</th>
										<th>mech</th>
										<th>story</th>
										<th>ctrl</th>
										<th>combat</th>
										<th>부족</th>
										<th>deaths</th>
										<th>hit%</th>
										<th>dur</th>
									</tr>
								</thead>
								<tbody>
									{#each surveyStats.cross as row}
										<tr
											class="clickable"
											on:click={() => {
												section = 'sessions';
												selectedSessionId = row.sessionId;
											}}
										>
											<td><code>{row.sessionId.slice(0, 8)}…</code></td>
											<td>{row.mechanism ?? '-'}</td>
											<td>{row.story ?? '-'}</td>
											<td>{row.controls ?? '-'}</td>
											<td>{row.combat ?? '-'}</td>
											<td>{row.lacking}</td>
											<td>{row.deaths ?? '-'}</td>
											<td>{pct(row.hitRate)}</td>
											<td>{fmtDur(row.durationS)}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>

						<div class="panel">
							<p class="panel-title">자유 피드백</p>
							{#each surveyStats.feedbacks as row}
								<article class="feedback-item">
									<button
										type="button"
										class="feedback-link"
										on:click={() => {
											section = 'sessions';
											selectedSessionId = row.sessionId;
										}}
									>
										<code>{row.sessionId.slice(0, 10)}…</code>
										{#if row.build}<span>{row.build}</span>{/if}
									</button>
									<p>{row.text}</p>
								</article>
							{:else}
								<p class="muted">작성된 피드백 없음</p>
							{/each}
						</div>
					{/if}
				{:else if section === 'compare'}
					<div class="compare-pick">
						<label>
							Build A
							<select bind:value={compareA}>
								{#each availableBuilds as b}
									<option value={b}>{b}</option>
								{/each}
							</select>
						</label>
						<label>
							Build B
							<select bind:value={compareB}>
								{#each availableBuilds as b}
									<option value={b}>{b}</option>
								{/each}
							</select>
						</label>
						{#if compare?.lowN}
							<span class="badge">참고용 · n&lt;30</span>
						{/if}
					</div>
					{#if compare}
						<div class="panel">
							<p class="panel-title">KPI 델타 (B − A)</p>
							<table>
								<thead>
									<tr>
										<th>metric</th>
										<th>{compare.buildA}</th>
										<th>{compare.buildB}</th>
										<th>Δ</th>
										<th>n</th>
									</tr>
								</thead>
								<tbody>
									{#each compare.deltas as d}
										<tr>
											<td>{d.label}</td>
											<td>{d.unit === 'rate' ? pct(d.a) : d.unit === 'seconds' ? fmtDur(d.a) : d.a ?? '-'}</td>
											<td>{d.unit === 'rate' ? pct(d.b) : d.unit === 'seconds' ? fmtDur(d.b) : d.b ?? '-'}</td>
											<td class:pos={d.delta != null && d.delta > 0} class:neg={d.delta != null && d.delta < 0}>
												{d.unit === 'rate'
													? d.delta == null
														? '-'
														: `${d.delta > 0 ? '+' : ''}${(d.delta * 100).toFixed(1)}%p`
													: d.unit === 'seconds'
														? d.delta == null
															? '-'
															: fmtDur(Math.abs(d.delta))
														: d.delta ?? '-'}
											</td>
											<td>{d.nA}/{d.nB}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
						<div class="panel">
							<p class="panel-title">Stage duration / deaths / hit</p>
							<table>
								<thead>
									<tr>
										<th>stage</th>
										<th>dur A/B</th>
										<th>deaths A/B</th>
										<th>hit A/B</th>
									</tr>
								</thead>
								<tbody>
									{#each compare.stages as row}
										<tr>
											<td><code>{row.stage}</code></td>
											<td>{fmtDur(row.durationA)} / {fmtDur(row.durationB)}</td>
											<td>{fmtNum(row.deathsA)} / {fmtNum(row.deathsB)}</td>
											<td>{pct(row.hitA)} / {pct(row.hitB)}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}
				{/if}
			{/if}
		{/if}
	</div>
{/if}

<style lang="scss">
	@import '../../../lib/scss/variable.scss';

	.analyze {
		max-width: 1180px;
		margin: 0 auto;
		padding: 28px 24px 80px;
		color: $black-color;
	}

	.top {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 22px;
	}

	.eyebrow {
		margin: 0 0 6px;
		font-size: 0.7rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba($black-color, 0.4);
	}

	h1 {
		margin: 0 0 6px;
		font-size: 1.6rem;
	}

	.lead,
	.muted,
	.hint,
	.progressive,
	.health {
		margin: 0;
		font-size: 0.88rem;
		color: rgba($black-color, 0.55);
	}

	.hint {
		margin-bottom: 12px;
	}

	.error,
	.empty {
		padding: 16px;
		border: 1.5px solid rgba($black-color, 0.15);
		color: rgba($black-color, 0.7);
	}

	.error {
		color: #b00020;
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 16px 24px;
		align-items: flex-end;
		margin-bottom: 18px;
		padding-bottom: 16px;
		border-bottom: 1px solid rgba($black-color, 0.12);
	}

	.filter-label {
		margin: 0 0 8px;
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba($black-color, 0.4);
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.chip {
		appearance: none;
		border: 1px solid rgba($black-color, 0.25);
		background: transparent;
		padding: 6px 10px;
		font: inherit;
		cursor: pointer;
		color: $black-color;
	}

	.chip.on {
		background: $semi-black-color;
		border-color: $semi-black-color;
		color: $white-color;
	}

	.check,
	.num {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 0.82rem;
	}

	.num input,
	.num select,
	.session-tools input,
	.compare-pick select {
		border: 1px solid rgba($black-color, 0.25);
		background: transparent;
		padding: 8px 10px;
		font: inherit;
		color: $black-color;
		min-width: 120px;
	}

	.tabs {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		margin-bottom: 18px;
	}

	.tabs button {
		appearance: none;
		border: 0;
		background: transparent;
		padding: 8px 12px;
		font: inherit;
		cursor: pointer;
		color: rgba($black-color, 0.55);
		border-bottom: 2px solid transparent;
	}

	.tabs button.active {
		color: $black-color;
		border-bottom-color: $black-color;
		font-weight: 700;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 10px;
		margin-bottom: 16px;
	}

	.stats.compact {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}

	.stat {
		border: 1px solid rgba($black-color, 0.12);
		padding: 12px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.stat span {
		font-size: 0.72rem;
		color: rgba($black-color, 0.45);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.stat strong {
		background: transparent;
		color: $black-color;
		font-size: 1.25rem;
	}

	.stat em {
		font-style: normal;
		font-size: 0.72rem;
		color: rgba($black-color, 0.4);
	}

	.grid-2 {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px;
		margin-bottom: 14px;
	}

	.panel {
		border: 1px solid rgba($black-color, 0.12);
		padding: 14px;
		margin-bottom: 14px;
	}

	.panel-title {
		margin: 0 0 12px;
		font-size: 0.85rem;
		font-weight: 700;
	}

	.bar-row,
	.dual,
	.funnel-row {
		display: grid;
		grid-template-columns: minmax(100px, 1.2fr) 1fr auto;
		gap: 8px;
		align-items: center;
		margin-bottom: 8px;
	}

	.funnel-row {
		width: 100%;
		appearance: none;
		border: 0;
		background: transparent;
		padding: 0;
		font: inherit;
		color: inherit;
		text-align: left;
		cursor: pointer;
	}

	.bar-label {
		font-size: 0.8rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mono,
	code {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.78rem;
	}

	.bar-track {
		height: 8px;
		background: rgba($black-color, 0.08);
		overflow: hidden;
	}

	.bar-track.tall {
		height: 12px;
	}

	.bar-fill {
		height: 100%;
		background: $semi-black-color;
	}

	.bar-fill.danger,
	.mini.danger {
		background: #8a3a32;
	}

	.mini.ok {
		background: #3d6b4f;
	}

	.bar-val {
		font-size: 0.78rem;
		color: rgba($black-color, 0.65);
		white-space: nowrap;
	}

	.bar-val small {
		margin-left: 4px;
		opacity: 0.7;
	}

	.dual-bars {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.mini {
		height: 6px;
		background: $semi-black-color;
	}

	.funnel-meta {
		display: flex;
		flex-direction: column;
		gap: 2px;
		font-size: 0.78rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.82rem;
	}

	th,
	td {
		text-align: left;
		padding: 8px 6px;
		border-bottom: 1px solid rgba($black-color, 0.08);
		vertical-align: top;
	}

	tr.clickable {
		cursor: pointer;
	}

	tr.clickable:hover,
	tr.active {
		background: rgba($black-color, 0.05);
	}

	.scatter {
		width: 100%;
		height: 240px;
		border: 1px solid rgba($black-color, 0.1);
		color: $black-color;
		margin: 8px 0;
	}

	.session-tools {
		margin-bottom: 12px;
	}

	.session-tools input {
		width: min(420px, 100%);
	}

	.session-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}

	.timeline {
		list-style: none;
		margin: 12px 0 0;
		padding: 0;
		max-height: 420px;
		overflow: auto;
	}

	.timeline li {
		border-bottom: 1px solid rgba($black-color, 0.06);
	}

	.tl-btn {
		width: 100%;
		display: flex;
		gap: 12px;
		align-items: baseline;
		appearance: none;
		border: 0;
		background: transparent;
		padding: 8px 4px;
		font: inherit;
		color: inherit;
		text-align: left;
		cursor: pointer;
	}

	.tl-btn:hover {
		background: rgba($black-color, 0.04);
	}

	.t {
		flex: 0 0 72px;
		font-size: 0.75rem;
		color: rgba($black-color, 0.45);
	}

	.json,
	.survey-box pre {
		margin-top: 12px;
		padding: 12px;
		background: rgba($black-color, 0.04);
		overflow: auto;
		font-size: 0.75rem;
		max-height: 280px;
	}

	.compare-pick {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		align-items: end;
		margin-bottom: 14px;
	}

	.compare-pick label {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 0.82rem;
	}

	.badge {
		align-self: center;
		padding: 4px 8px;
		border: 1px solid rgba($black-color, 0.25);
		font-size: 0.75rem;
	}

	.pos {
		color: #2f6f4e;
	}

	.neg {
		color: #8a3a32;
	}

	.wrap {
		max-width: 280px;
		word-break: break-word;
	}

	.preset {
		margin-bottom: 12px;
	}

	.feedback-item {
		padding: 12px 0;
		border-bottom: 1px solid rgba($black-color, 0.08);
	}

	.feedback-item:last-child {
		border-bottom: 0;
	}

	.feedback-link {
		appearance: none;
		border: 0;
		background: transparent;
		padding: 0;
		margin: 0 0 6px;
		display: flex;
		gap: 10px;
		align-items: baseline;
		font: inherit;
		color: rgba($black-color, 0.55);
		cursor: pointer;
	}

	.feedback-link:hover {
		color: $black-color;
	}

	.feedback-item p {
		margin: 0;
		line-height: 1.5;
		white-space: pre-wrap;
	}

	@media (max-width: 860px) {
		.grid-2,
		.stats.compact {
			grid-template-columns: 1fr;
		}

		.bar-row,
		.dual,
		.funnel-row {
			grid-template-columns: 1fr;
		}
	}
</style>
