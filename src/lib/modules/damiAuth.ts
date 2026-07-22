const AUTHOR_KEY = 'dami-feedback-author-v1';

export const getDamiAuthorId = () => {
	if (typeof localStorage === 'undefined') return '';
	let id = localStorage.getItem(AUTHOR_KEY);
	if (!id) {
		id =
			typeof crypto !== 'undefined' && 'randomUUID' in crypto
				? crypto.randomUUID()
				: `dami-${Date.now()}-${Math.random().toString(36).slice(2)}`;
		localStorage.setItem(AUTHOR_KEY, id);
	}
	return id;
};

/** 닉네임+비밀번호가 있으면 비밀번호로 열람 (기기 무관) */
export const isPasswordProtectedFeedback = (item: {
	nickname?: string;
	passwordHash?: string;
}) => !!item.nickname?.trim() && !!item.passwordHash;

/**
 * 닉네임이 없을 때만 같은 기기(authorId)로 열람.
 * 닉네임+비번이 있으면 기기 자동 열람 불가.
 */
export const canOpenFeedbackByDevice = (
	item: { authorId?: string; nickname?: string; passwordHash?: string },
	authorId: string
) => {
	if (!authorId || !item.authorId || item.authorId !== authorId) return false;
	if (isPasswordProtectedFeedback(item)) return false;
	return !item.nickname?.trim();
};

export const canAttemptFeedbackOpen = (
	item: { authorId?: string; nickname?: string; passwordHash?: string },
	authorId: string
) => isPasswordProtectedFeedback(item) || canOpenFeedbackByDevice(item, authorId);

export const hashDamiPassword = async (password: string) => {
	const trimmed = password.trim();
	if (!trimmed) return '';
	const data = new TextEncoder().encode(`dami-feedback:${trimmed}`);
	const buf = await crypto.subtle.digest('SHA-256', data);
	return Array.from(new Uint8Array(buf))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
};

export const formatDamiDate = (date: Date | null) => {
	if (!date) return '-';
	return date.toLocaleString('ko-KR');
};

export const formatDamiDuration = (ms: number) => {
	const total = Math.max(0, Math.floor(ms / 1000));
	const m = Math.floor(total / 60)
		.toString()
		.padStart(2, '0');
	const s = (total % 60).toString().padStart(2, '0');
	return `${m}:${s}`;
};
