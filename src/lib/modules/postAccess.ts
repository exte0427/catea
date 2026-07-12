import { browser } from '$app/environment';

const POST_ACCESS_KEY = 'catea-post-access-v2';

export const hasPostAccess = (): boolean => {
	if (!browser) return false;
	return sessionStorage.getItem(POST_ACCESS_KEY) === '1';
};

export const grantPostAccess = (): void => {
	if (!browser) return;
	sessionStorage.setItem(POST_ACCESS_KEY, '1');
};

export const checkPostAccessAnswer = (answer: string): boolean => {
	const normalized = answer.trim().toLowerCase().replace(/\s/g, '');
	return (
		normalized === 'lucid' ||
		normalized === '루시드' ||
		normalized.includes('lucid') ||
		normalized.includes('루시드')
	);
};
