export const categoryLabels: Record<string, string> = {
	all: '전체',
	novel: '소설',
	essay: '에세이',
	poem: '시',
	other: '기타'
};

export const getCategoryLabel = (category: string): string =>
	categoryLabels[category] ?? category;
