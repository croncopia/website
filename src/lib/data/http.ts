export type Fetch = typeof globalThis.fetch;

export async function getJson<T>(fetchFn: Fetch, url: string): Promise<T> {
	const res = await fetchFn(url);
	if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
	return res.json() as Promise<T>;
}
