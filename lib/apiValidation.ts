import categories from "@/lib/categories";

const ID_RE = /^[a-zA-Z0-9-]{8,80}$/;
const CATEGORY_RE = /^[a-zA-Z0-9_-]{1,40}$/;

export async function readJsonBody<T>(req: Request): Promise<T | null> {
	const contentLength = Number(req.headers.get("content-length") || 0);
	if (contentLength > 10_000) {
		return null;
	}

	try {
		return (await req.json()) as T;
	} catch {
		return null;
	}
}

export function sanitizeText(value: unknown, maxLength: number) {
	if (typeof value !== "string") {
		return "";
	}

	return value
		.replace(/[\u0000-\u001f\u007f]/g, "")
		.trim()
		.slice(0, maxLength);
}

export function normalizeId(value: unknown) {
	const id = sanitizeText(value, 80);
	return ID_RE.test(id) ? id : "";
}

export function normalizeCategory(value: unknown) {
	const category = sanitizeText(value, 40);
	return CATEGORY_RE.test(category) && categories[category] ? category : "";
}

export function normalizeCategoryArg(category: string, value: unknown) {
	const arg = sanitizeText(value, 80);
	if (!arg) {
		return undefined;
	}

	const allowed = categories[category]?.subcategories;
	if (allowed && allowed[arg]) {
		return arg;
	}

	return undefined;
}

export function normalizeTeamNumbers(searchParams: URLSearchParams, maxTeams = 10) {
	return [...new Set(searchParams.getAll("team")
		.map((team) => Number(team))
		.filter((team) => Number.isInteger(team) && team > 0 && team < 20_000))]
		.slice(0, maxTeams);
}
