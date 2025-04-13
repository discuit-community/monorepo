import { DiscuitUrls } from "@discuit-community/client";

const urls = new DiscuitUrls();

const PUBLIC_ENDPOINTS = new Set([
	"/posts",
	"/communities",
	"/users",
	"/_initial",
]);

function isPublicPath(path: string): boolean {
	return (
		PUBLIC_ENDPOINTS.has(path.split("?")[0]) ||
		PUBLIC_ENDPOINTS.has("/" + path.split("/")[1])
	);
}

const server = Bun.serve({
	port: process.env.PORT || 49152,
	async fetch(req) {
		if (req.method === "OPTIONS") {
			return new Response(null, {
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type",
				},
			});
		}

		const url = new URL(req.url);
		const path = url.pathname + url.search;

		if (url.pathname === "/") {
			return new Response(
				JSON.stringify({
					name: "@discuit-community/proxy",
					about:
						"this is a proxy server that allows unauthenticated requests to the " +
						"discuit api, bypassing CORS restrictions",
					repo: "https://github.com/sillowww/discuit-community",
				}),
				{ status: 200, headers: { "Content-Type": "application/json" } },
			);
		}

		if (req.method !== "GET" || !isPublicPath(path))
			return new Response("not found", { status: 404 });

		try {
			const response = await fetch(`${urls.api.base()}${path}`, {
				headers: {
					"Accept-Encoding": "gzip, deflate, br",
					Accept: "application/json",
					"User-Agent": "DiscuitCommunity/Proxy",
				},
			});

			const data = await response.json();

			return new Response(JSON.stringify(data), {
				status: response.status,
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Content-Type": "application/json",
					"Cache-Control": "no-cache",
				},
			});
		} catch (error) {
			console.error("proxy error:", error);
			return new Response("internal server error", { status: 500 });
		}
	},
});

console.log(`proxy running on http://localhost:${server.port}`);
