import { EventEmitter } from "events";
import { DiscuitClient } from "@discuit-community/client";
import type { Post, Comment } from "@discuit-community/types";

export type JetstreamEvent =
	| { type: "new_post"; post: Post }
	| { type: "new_comment"; comment: Comment; postId: string };

export class Jetstream extends EventEmitter {
	private client: DiscuitClient;
	private seenPosts = new Set<string>();
	private seenComments = new Set<string>();
	private pollingInterval: number;
	private commentPollingInterval: number;
	private startTime: Date;

	private retryAmount: number;
	private retryDelay: number;
	private running = false;

	constructor(options: {
		client: DiscuitClient;
		pollingInterval?: number;
		commentPollingInterval?: number;
		retryAmount?: number;
	}) {
		super();
		this.client = options.client;
		this.pollingInterval = options.pollingInterval ?? 1000;
		this.commentPollingInterval = options.commentPollingInterval ?? 1000;
		this.startTime = new Date();
		this.retryAmount = options.retryAmount ?? 3;
		this.retryDelay = 200;
	}

	async start() {
		this.running = true;
		this.pollForPosts();
		this.pollForComments();
		return this;
	}

	stop() {
		this.running = false;
	}

	private async pollForPosts() {
		while (this.running) {
			let retries = 0;
			while (retries <= this.retryAmount) {
				try {
					const [result, error] = await this.client.getPosts({
						feed: "all",
						sort: "latest",
						limit: 20,
					});

					if (error) {
						retries++;
						if (retries > this.retryAmount) {
							this.emit("error", error);
							break;
						}
						await Bun.sleep(this.retryDelay);
					} else {
						const newPosts = result.filter((post) => {
							if (this.seenPosts.has(post.raw.id)) return false;
							const postDate = new Date(post.raw.createdAt);
							return postDate >= this.startTime;
						});

						newPosts.forEach((post) => this.handleNewPost(post.raw));

						if (newPosts.length > 0) {
							this.emit("log", `received ${newPosts.length} new posts`);
						}

						if (this.seenPosts.size > 1000) {
							const recentIds = [...this.seenPosts].slice(-500);
							this.seenPosts = new Set(recentIds);
						}

						break;
					}
				} catch (error) {
					retries++;
					if (retries > this.retryAmount) {
						this.emit("error", error);
						break;
					}
					await Bun.sleep(this.retryDelay);
				}
			}

			await Bun.sleep(this.pollingInterval);
		}
	}

	private async pollForComments() {
		while (this.running) {
			let retries = 0;

			while (retries < this.retryAmount) {
				try {
					const [result, error] = await this.client.getPosts({
						feed: "all",
						sort: "activity",
						limit: 10,
					});

					if (error) {
						retries++;
						if (retries > this.retryAmount) {
							this.emit("error", error);
							break;
						}
						await Bun.sleep(this.retryDelay);
					} else {
						for (const postModel of result) {
							const post = postModel.raw;
							if (post.noComments === 0) continue;
							const [comments, commentsError] = await postModel.getComments();

							if (commentsError) {
								this.emit("error", commentsError);
								continue;
							}

							const newComments = comments.filter((comment) => {
								if (this.seenComments.has(comment.raw.id)) return false;
								const commentDate = new Date(comment.raw.createdAt);
								return commentDate >= this.startTime;
							});

							newComments.forEach((commentModel) => {
								const comment = commentModel.raw;
								this.seenComments.add(comment.id);
								this.emit("new_comment", comment, post.id);
							});
						}

						if (this.seenComments.size > 5000) {
							const recentIds = [...this.seenComments].slice(-2500);
							this.seenComments = new Set(recentIds);
						}

						break;
					}
				} catch (error) {
					retries++;
					if (retries > this.retryAmount) {
						this.emit("error", error);
						break;
					}
					await Bun.sleep(this.retryDelay);
				}
			}

			await Bun.sleep(this.commentPollingInterval);
		}
	}

	private handleNewPost(post: Post) {
		this.seenPosts.add(post.id);
		this.emit("new_post", post);
	}
}
