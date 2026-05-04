import {getApps, initializeApp, cert} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

if (!getApps().length) {
	initializeApp({
		credential: cert({
			projectId: process.env.FIREBASE_PROJECT_ID!,
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
			privateKey: atob(process.env.FIREBASE_PRIVATE_KEY!),
		})
	});
}

const db = getFirestore();

function safeId(value: string) {
	return Buffer.from(value).toString("base64url");
}

function scoresRef(key: string) {
	return db
		.collection("leaderboards")
		.doc(safeId(key))
		.collection("scores");
}

// ---------- Sorted Sets ----------

export async function zadd(key: string, score: number, member: string) {
	await scoresRef(key).doc(safeId(member)).set(
		{
			member,
			score,
			updatedAt: Date.now(),
		},
		{merge: true},
	);

	return {result: 1};
}

export async function zrevrangeWithScores(
	key: string,
	start: number,
	stop: number,
) {
	const amount = stop - start + 1;

	if (amount <= 0) {
		return {result: []};
	}

	const snap = await scoresRef(key)
		.orderBy("score", "desc")
		.orderBy("member", "asc")
		.offset(start)
		.limit(amount)
		.get();

	const flat: Array<string | number> = [];

	for (const doc of snap.docs) {
		const data = doc.data();
		flat.push(data.member, data.score);
	}

	return {result: flat};
}

export async function zscore(key: string, member: string) {
	const snap = await scoresRef(key).doc(safeId(member)).get();

	if (!snap.exists) {
		return {result: null};
	}

	return {result: snap.data()?.score ?? null};
}

export async function zrevrank(key: string, member: string) {
	const memberSnap = await scoresRef(key).doc(safeId(member)).get();

	if (!memberSnap.exists) {
		return {result: null};
	}

	const data = memberSnap.data();
	const score = data?.score;

	const higherScoresSnap = await scoresRef(key)
		.where("score", ">", score)
		.count()
		.get();

	const sameScoreBeforeSnap = await scoresRef(key)
		.where("score", "==", score)
		.where("member", "<", member)
		.count()
		.get();

	const rank =
		higherScoresSnap.data().count +
		sameScoreBeforeSnap.data().count;

	return {result: rank};
}

// ---------- KV JSON ----------

function removeUndefined<T>(value: T): T {
	if (Array.isArray(value)) {
		return value.map(removeUndefined) as T;
	}

	if (value && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value)
				.filter(([, v]) => v !== undefined)
				.map(([k, v]) => [k, removeUndefined(v)]),
		) as T;
	}

	return value;
}

export async function setJson(key: string, value: unknown) {
	await db.collection("kv").doc(safeId(key)).set({
		key,
		value: removeUndefined(value),
		updatedAt: Date.now(),
	});

	return { result: "OK" };
}

export async function getJson<T>(key: string): Promise<T | null> {
	const snap = await db.collection("kv").doc(safeId(key)).get();

	if (!snap.exists) {
		return null;
	}

	return (snap.data()?.value as T) ?? null;
}