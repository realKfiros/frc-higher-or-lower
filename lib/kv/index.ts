const useLocalRedis = !!process.env.REDIS_URL;

export const kv = useLocalRedis
	? await import("./redis")
	: await import("./upstash");
