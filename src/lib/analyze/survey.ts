import '$lib/modules/firebase';
import {
	collection,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	serverTimestamp,
	setDoc
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import type { SurveyResponse } from './types';

export const SURVEY_COLLECTION = 'dami_survey_responses';

export const LIKERT_QUESTIONS = [
	{
		key: 'mechanism',
		label: '게임의 메커니즘(플레이방식)이 이해 되었나요?'
	},
	{
		key: 'story',
		label: '게임의 스토리가 이해 되었나요?'
	},
	{
		key: 'controls',
		label: '조작감은 만족스러우셨나요?'
	},
	{
		key: 'combat',
		label: '전투는 만족스러우셨나요?'
	}
] as const;

export const LACKING_OPTIONS = ['게임성', '완성도', '대중성', '개성'] as const;

export type LikertKey = (typeof LIKERT_QUESTIONS)[number]['key'];
export type LackingOption = (typeof LACKING_OPTIONS)[number];

export type SurveyAnswers = {
	mechanism: number;
	story: number;
	controls: number;
	combat: number;
	lacking: LackingOption;
	feedback: string;
};

const ensureAuth = async () => {
	const auth = getAuth();
	if (auth.currentUser) return;
	await signInAnonymously(auth);
};

const mapDoc = (id: string, data: Record<string, unknown>): SurveyResponse | null => {
	const sessionId = String(data.session_id || data.sessionId || id).trim();
	if (!sessionId) return null;

	const rawAnswers =
		data.answers && typeof data.answers === 'object'
			? (data.answers as Record<string, unknown>)
			: {};

	const answers: Record<string, unknown> = { ...rawAnswers };
	for (const q of LIKERT_QUESTIONS) {
		if (answers[q.key] == null && data[q.key] != null) answers[q.key] = data[q.key];
	}
	if (answers.lacking == null && data.lacking != null) answers.lacking = data.lacking;
	if (answers.feedback == null) {
		answers.feedback =
			data.feedback || data.freeText || data.free_text || data.comment || rawAnswers.feedback || '';
	}

	const mechanism = Number(answers.mechanism);
	const difficultyRaw =
		data.difficulty ??
		data.difficulty_score ??
		(Number.isFinite(mechanism) ? mechanism : answers.difficulty);
	const difficulty =
		typeof difficultyRaw === 'number'
			? difficultyRaw
			: typeof difficultyRaw === 'string' && difficultyRaw.trim()
				? Number(difficultyRaw)
				: null;

	return {
		id,
		sessionId,
		build: String(data.build || data.build_version || '') || undefined,
		answers,
		difficulty: Number.isFinite(difficulty as number) ? (difficulty as number) : null,
		freeText: String(answers.feedback || ''),
		createdAt: String(
			(data.createdAt as { toDate?: () => Date })?.toDate?.()?.toISOString?.() ||
				data.createdAt ||
				data.updatedAt ||
				''
		)
	};
};

export const loadSurveyResponses = async (): Promise<SurveyResponse[]> => {
	await ensureAuth();
	const db = getFirestore();
	const out: SurveyResponse[] = [];
	const seen = new Set<string>();

	try {
		const snap = await getDocs(collection(db, SURVEY_COLLECTION));
		snap.forEach((docSnap) => {
			const mapped = mapDoc(docSnap.id, docSnap.data() as Record<string, unknown>);
			if (!mapped || seen.has(mapped.sessionId)) return;
			seen.add(mapped.sessionId);
			out.push(mapped);
		});
	} catch (err) {
		console.warn('survey load failed', err);
	}
	return out;
};

export const getSurveyBySession = async (sessionId: string): Promise<SurveyResponse | null> => {
	if (!sessionId) return null;
	await ensureAuth();
	const snap = await getDoc(doc(getFirestore(), SURVEY_COLLECTION, sessionId));
	if (!snap.exists()) return null;
	return mapDoc(snap.id, snap.data() as Record<string, unknown>);
};

export const submitSurveyResponse = async (input: {
	sessionId: string;
	build: string;
	answers: SurveyAnswers;
}) => {
	const sessionId = input.sessionId.trim();
	if (!sessionId) throw new Error('session_id가 필요합니다.');
	for (const q of LIKERT_QUESTIONS) {
		const v = input.answers[q.key];
		if (!Number.isInteger(v) || v < 1 || v > 5) {
			throw new Error(`${q.label} 항목을 1–5로 선택해 주세요.`);
		}
	}
	if (!LACKING_OPTIONS.includes(input.answers.lacking)) {
		throw new Error('가장 부족한 부분을 선택해 주세요.');
	}

	await ensureAuth();
	const ref = doc(getFirestore(), SURVEY_COLLECTION, sessionId);
	const existing = await getDoc(ref);
	const payload = {
		session_id: sessionId,
		sessionId,
		build: input.build || '',
		build_version: input.build || '',
		product: 'DAMI',
		answers: {
			mechanism: input.answers.mechanism,
			story: input.answers.story,
			controls: input.answers.controls,
			combat: input.answers.combat,
			lacking: input.answers.lacking,
			feedback: input.answers.feedback.trim()
		},
		difficulty: input.answers.mechanism,
		freeText: input.answers.feedback.trim(),
		updatedAt: serverTimestamp(),
		...(existing.exists() ? {} : { createdAt: serverTimestamp() })
	};

	await setDoc(ref, payload, { merge: true });
	return sessionId;
};
