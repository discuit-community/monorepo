import { Jetstream, type JetstreamEvent } from "./core";

export enum Topic {
	NEW_POST = "new_post",
	NEW_COMMENT = "new_comment",
	ALL = "all",
}

export class JetstreamServer {
	private jetstream: Jetstream;
	private server: ReturnType<typeof Bun.serve>;

	constructor(options: { jetstream: Jetstream; port?: number }) {
		this.jetstream = options.jetstream;
		this.server = this.createServer(options.port ?? 3001);
		this.setupEventHandlers();
	}

	private createServer(port: number) {
		return Bun.serve({
			port,
			fetch: (req, server) => {
				if (new URL(req.url).pathname === "/ws") {
					const success = server.upgrade(req, {
						data: { connectedAt: Date.now() },
					});
					return success
						? undefined
						: new Response("upgrade failed", { status: 400 });
				}
				return new Response(
					"400: connect via websocket instead @ ws://localhost:3001/ws",
					{ status: 400 },
				);
			},
			websocket: {
				open: (ws) => {
					ws.subscribe(Topic.ALL);
					console.log(`new connection from ${ws.remoteAddress}`);
				},
				close: (ws) => {
					ws.unsubscribe(Topic.ALL);
				},
				message: (ws, message) => {
					try {
						const data = JSON.parse(String(message));

						if (data.action === "subscribe" && data.topics) {
							const topics = Array.isArray(data.topics)
								? data.topics
								: [data.topics];
							topics.forEach((topic: string) => {
								if (Object.values(Topic).includes(topic as Topic)) {
									ws.subscribe(topic);
									console.log(`Client subscribed to ${topic}`);
								}
							});
						}

						if (data.action === "unsubscribe" && data.topics) {
							const topics = Array.isArray(data.topics)
								? data.topics
								: [data.topics];
							topics.forEach((topic: string) => {
								if (ws.isSubscribed(topic)) {
									ws.unsubscribe(topic);
									console.log(`Client unsubscribed from ${topic}`);
								}
							});
						}
					} catch (e) {
						console.error("Failed to parse message:", e);
					}
				},
				perMessageDeflate: true,
				idleTimeout: 300,
			},
		});
	}

	private setupEventHandlers() {
		this.jetstream.on("new_post", (post) => {
			const event: JetstreamEvent = { type: "new_post", post };
			const message = JSON.stringify(event);
			this.server.publish(Topic.NEW_POST, message);
			this.server.publish(Topic.ALL, message);
		});

		this.jetstream.on("new_comment", (comment, postId) => {
			const event: JetstreamEvent = { type: "new_comment", comment, postId };
			const message = JSON.stringify(event);
			this.server.publish(Topic.NEW_COMMENT, message);
			this.server.publish(Topic.ALL, message);
		});

		this.jetstream.on("error", (error) => {
			console.error("Jetstream error:", error);
		});

		this.jetstream.on("log", (message) => {
			console.log(`  > ${message}`);
		});
	}

	getInfo() {
		return {
			url: `ws://${this.server.hostname}:${this.server.port}/ws`,
		};
	}

	stop() {
		this.server.stop();
	}
}
