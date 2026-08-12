import '$lib/modules/firebase';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { parseJsonl } from './parse';
import type { SessionBundle } from './aggregate';
import { loadSurveyResponses } from './survey';
import type { SessionMetaDoc, SurveyResponse } from './types';

const ensureAuth = async () => {
	const auth = getAuth();
	if (auth.currentUser) return;
	await signInAnonymously(auth);
};

export const listPlaytestSessions = async (): Promise<SessionMetaDoc[]> => {
	await ensureAuth();
	const snap = await getDocs(collection(getFirestore(), 'playtest_sessions'));
	const rows: SessionMetaDoc[] = [];
	snap.forEach((docSnap) => {
		const d = docSnap.data() as Partial<SessionMetaDoc>;
		rows.push({
			sessionId: d.sessionId || docSnap.id,
			product: d.product || 'DAMI',
			buildVersion: d.buildVersion || '',
			storagePath: d.storagePath || '',
			bytes: d.bytes || 0,
			deviceModel: d.deviceModel || '',
			meta: d.meta ?? null,
			updatedAt: d.updatedAt || ''
		});
	});
	return rows.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
};

export const downloadSessionJsonl = async (storagePath: string) => {
	await ensureAuth();
	const url = await getDownloadURL(ref(getStorage(), storagePath));
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Storage download failed: ${res.status}`);
	return parseJsonl(await res.text());
};

export const loadPlaytestBundles = async (
	onProgress?: (done: number, total: number) => void
): Promise<{ bundles: SessionBundle[]; surveys: SurveyResponse[]; lastUpdatedAt: string }> => {
	const [metas, surveys] = await Promise.all([listPlaytestSessions(), loadSurveyResponses()]);
	const surveyMap = new Map(surveys.map((s) => [s.sessionId, s]));
	const bundles: SessionBundle[] = [];
	let done = 0;
	const total = metas.length;
	onProgress?.(0, total);

	const concurrency = 4;
	let i = 0;
	const workers = Array.from({ length: concurrency }, async () => {
		while (i < metas.length) {
			const idx = i++;
			const meta = metas[idx];
			try {
				const events = meta.storagePath ? await downloadSessionJsonl(meta.storagePath) : [];
				bundles.push({ meta, events, survey: surveyMap.get(meta.sessionId) || null });
			} catch (err) {
				console.warn('session load failed', meta.sessionId, err);
				bundles.push({ meta, events: [], survey: surveyMap.get(meta.sessionId) || null });
			} finally {
				done += 1;
				onProgress?.(done, total);
			}
		}
	});
	await Promise.all(workers);
	const lastUpdatedAt = metas[0]?.updatedAt || '';
	return { bundles, surveys, lastUpdatedAt };
};
