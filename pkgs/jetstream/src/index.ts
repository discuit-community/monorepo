import { DiscuitClient } from "@discuit-community/client";
import type { Post, Comment } from "@discuit-community/types";

type JetstreamEvent =
	| { type: "new_post"; post: Post }
	| { type: "new_comment"; comment: Comment; postId: string };

export enum Topic {
	NEW_POSTS = "new_posts",
	NEW_COMMENTS = "new_comments",
	ALL = "all",
}

export class Jetstream {
	private client: DiscuitClient;
	private server?: ReturnType<typeof Bun.serve>;
	private seenPosts = new Set<string>();
	private seenComments = new Set<string>();
	private pollingInterval: number;
	private commentPollingInterval: number;
	private startTime: Date;

	constructor(options: {
		client: DiscuitClient;
		port?: number;
		pollingInterval?: number;
		commentPollingInterval?: number;
	}) {
		this.client = options.client;
		this.pollingInterval = options.pollingInterval ?? 1000;
		this.commentPollingInterval = options.commentPollingInterval ?? 1000;
		this.server = this.createServer(options.port ?? 3001);
		this.startTime = new Date();
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

	async start() {
		console.log(
			`jetstream running on ws://${this.server?.hostname}:${this.server?.port}/ws`,
		);
		this.pollForPosts();
		this.pollForComments();
	}

	private async pollForPosts() {
		while (true) {
			try {
				const [result, error] = await this.client.getPosts({
					feed: "all",
					sort: "latest",
					limit: 20,
				});

				if (error) {
					console.error("error fetching posts:", error);
				} else {
					const newPosts = result.filter(
						(post) => !this.seenPosts.has(post.raw.id),
					);

					newPosts.forEach((post) => this.handleNewPost(post.raw));

					if (newPosts.length > 0) {
						console.log(`  > received ${newPosts.length} new posts`);
					} else {
						process.stdout.write(
							`\r  > no new posts @ ${new Date().toLocaleString()}`,
						);
					}

					if (this.seenPosts.size > 1000) {
						const recentIds = [...this.seenPosts].slice(-500);
						this.seenPosts = new Set(recentIds);
					}
				}
			} catch (err) {
				console.error("post polling error:", err);
			}

			await Bun.sleep(this.pollingInterval);
		}
	}

	private async pollForComments() {
		while (true) {
			try {
				const [result, error] = await this.client.getPosts({
					feed: "all",
					sort: "activity",
					limit: 10,
				});

				if (error) {
					console.error("error fetching active posts:", error);
				} else {
					for (const postModel of result) {
						const post = postModel.raw;
						if (post.noComments === 0) continue;
						const [comments, commentsError] = await postModel.getComments();

						if (commentsError) {
							console.error(
								`error fetching comments for post ${post.id}:`,
								commentsError,
							);
							continue;
						}

						const newComments = comments.filter((comment) => {
							if (this.seenComments.has(comment.raw.id)) return false;

							const commentDate = new Date(comment.raw.createdAt);
							if (commentDate < this.startTime) return false;

							return true;
						});

						newComments.forEach((commentModel) => {
							const comment = commentModel.raw;
							this.seenComments.add(comment.id);

							const event: JetstreamEvent = {
								type: "new_comment",
								comment,
								postId: post.id,
							};

							const message = JSON.stringify(event);
							this.server?.publish(Topic.NEW_COMMENTS, message);
							this.server?.publish(Topic.ALL, message);
						});

						if (newComments.length > 0) {
							console.write(
								`  > received ${newComments.length} new comments on post "${post.title}"`,
							);
						}
					}

					if (this.seenComments.size > 5000) {
						const recentIds = [...this.seenComments].slice(-2500);
						this.seenComments = new Set(recentIds);
					}
				}
			} catch (err) {
				console.error("comment polling error:", err);
			}

			await Bun.sleep(this.commentPollingInterval);
		}
	}

	private handleNewPost(post: Post) {
		this.seenPosts.add(post.id);

		const event: JetstreamEvent = { type: "new_post", post };
		const message = JSON.stringify(event);

		this.server?.publish(Topic.NEW_POSTS, message);
		this.server?.publish(Topic.ALL, message);
	}

	stop() {
		this.server?.stop();
	}
}

if (import.meta.url === `file://${Bun.main}`) {
	const client = new DiscuitClient();
	await client.initialize();

	const jetstream = new Jetstream({
		client,
		pollingInterval: 1000,
		commentPollingInterval: 1000,
	});

	await jetstream.start();
}
