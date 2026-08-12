export type AnalyticsEvent = {
	event: string;
	session_id: string;
	build_version: string;
	timestamp_ms: number;
	realtime_s?: number;
	stage_name?: string;
	x?: number | null;
	y?: number | null;
	z?: number | null;
	[key: string]: unknown;
};

export type SessionMetaDoc = {
	sessionId: string;
	product: string;
	buildVersion: string;
	storagePath: string;
	bytes: number;
	deviceModel?: string;
	meta?: Record<string, unknown> | null;
	updatedAt?: string;
};

export type AnalyzeFilters = {
	builds: string[];
	excludeEditor: boolean;
	minDurationS: number;
	fromMs: number | null;
	toMs: number | null;
	stage: string;
};

export type AnalyzeTab =
	| 'overview'
	| 'funnel'
	| 'stages'
	| 'combat'
	| 'items'
	| 'narrative'
	| 'quality'
	| 'sessions'
	| 'survey'
	| 'compare';

export type OverviewStats = {
	sessions: number;
	events: number;
	medianDurationS: number;
	demoStartRate: number;
	clearRate: number | null;
	medianHitRate: number | null;
	surveyResponseRate: number | null;
	errorSessionRate: number;
	medianFps: number | null;
	sessionsByDay: { day: string; count: number; deaths: number }[];
	sessionsByBuild: { build: string; count: number }[];
	endReasons: { reason: string; count: number }[];
	topIssues: { kind: 'death' | 'error'; label: string; count: number }[];
	n: {
		demoStarts: number;
		clears: number;
		hitRateSamples: number;
		surveyShown: number;
		surveyResponses: number;
		errorSessions: number;
		fpsSamples: number;
	};
};

export type FunnelStep = {
	id: string;
	label: string;
	count: number;
	rate: number;
	dropOff: number;
	dropAbs: number;
};

export type StageRow = {
	stage: string;
	reach: number;
	clears: number;
	clearRate: number;
	medianDurationS: number;
	p90DurationS: number;
	deathsPerSession: number;
	medianHitRate: number | null;
	itemUsesPerSession: number;
	deaths: number;
	itemUses: number;
};

export type CombatStats = {
	medianHitRate: number | null;
	medianNormalHitRate: number | null;
	medianSpecialHitRate: number | null;
	swingsPerMinute: number | null;
	absorbsPerSession: number;
	hitTakenPerMinute: number | null;
	hitRateHist: { bucket: string; count: number }[];
	byStage: { stage: string; medianHitRate: number | null; n: number }[];
	normalVsSpecial: { stage: string; normal: number | null; special: number | null; n: number }[];
	weaponModes: { mode: string; count: number }[];
	killMix: { enemy: string; count: number }[];
	absorbsByStage: { stage: string; count: number }[];
	hitTakenSources: { source: string; count: number }[];
	n: { sessionsWithCombat: number; swings: number; hits: number };
};

export type ItemStats = {
	byItem: { itemId: string; count: number; sessions: number; meanUses: number }[];
	usesHist: { bucket: string; count: number }[];
	byStage: { stage: string; itemId: string; count: number }[];
	firstUse: { itemId: string; medianRealtimeS: number; n: number }[];
	reasons: { reason: string; count: number }[];
	nearDeathBandageRate: number | null;
	n: { totalUses: number; sessionsWithItem: number };
};

export type NarrativeStats = {
	dialogueStarts: { nodeId: string; count: number }[];
	choices: { choiceId: string; label: string; count: number }[];
	tutorial: { id: string; shown: number; completed: number; incomplete: number }[];
};

export type QualityStats = {
	fpsByDay: { day: string; avgFps: number; n: number }[];
	fpsByStage: { stage: string; medianFps: number; n: number }[];
	hitchP95: number | null;
	errors: { message: string; count: number; sessions: number }[];
	errorsByDay: { day: string; count: number }[];
	n: { samples: number; errorEvents: number };
};

export type SessionRow = {
	sessionId: string;
	buildVersion: string;
	durationS: number;
	stagesReached: string[];
	deaths: number;
	hitRate: number | null;
	itemUses: number;
	hasSurvey: boolean;
	hasError: boolean;
	updatedAt: string;
	eventCount: number;
	deviceId: string;
};

export type SurveyResponse = {
	id: string;
	sessionId: string;
	build?: string;
	answers: Record<string, unknown>;
	difficulty?: number | null;
	freeText?: string;
	createdAt?: string;
};

export type SurveyJoinStats = {
	shown: number;
	submitted: number;
	responseRate: number | null;
	likertAverages: { key: string; label: string; avg: number | null; n: number }[];
	byQuestion: { key: string; label: string; values: { value: string; count: number }[] }[];
	lacking: { value: string; count: number }[];
	feedbacks: { sessionId: string; build: string; text: string; createdAt: string }[];
	cross: {
		sessionId: string;
		build: string;
		mechanism: number | null;
		story: number | null;
		controls: number | null;
		combat: number | null;
		lacking: string;
		difficulty: number | null;
		deaths: number | null;
		hitRate: number | null;
		durationS: number | null;
		freeText: string;
	}[];
};

export type CompareDelta = {
	key: string;
	label: string;
	a: number | null;
	b: number | null;
	delta: number | null;
	unit: 'count' | 'rate' | 'seconds' | 'ratio';
	nA: number;
	nB: number;
};

export type CompareStats = {
	buildA: string;
	buildB: string;
	nA: number;
	nB: number;
	lowN: boolean;
	deltas: CompareDelta[];
	funnelA: FunnelStep[];
	funnelB: FunnelStep[];
	stages: {
		stage: string;
		durationA: number | null;
		durationB: number | null;
		deathsA: number | null;
		deathsB: number | null;
		hitA: number | null;
		hitB: number | null;
	}[];
};
