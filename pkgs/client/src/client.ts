import type {
	User,
	Post,
	LoginRequest,
	SignupRequest,
	CreatePostRequest,
	Community,
} from "@discuit-community/types";
import { DiscuitUrls } from "./urls";
import { type Result, success, failure } from "./utils/errors";
import { PostModel } from "./models/post";
import { UserModel } from "./models/user";

export class DiscuitClient {
	private apiUrl: string;
	private baseUrl: string;
	private cookies: Record<string, string> = {};
	private csrfToken: string | null = null;

	public urls: DiscuitUrls;

	constructor(
		options: {
			baseUrl?: string;
			apiUrl?: string;
		} = {},
	) {
		this.baseUrl = options.baseUrl ?? "https://discuit.org";
		this.apiUrl = options.apiUrl ?? `${this.baseUrl}/api`;

		this.urls = new DiscuitUrls({
			baseUrl: this.baseUrl,
			apiUrl: this.apiUrl,
		});
	}

	async initialize(): Promise<Result<boolean>> {
		try {
			await this.initSession();
			return success(true);
		} catch (error) {
			return failure({
				status: 500,
				message:
					error instanceof Error
						? error.message
						: "failed to initialize client",
			});
		}
	}

	async login(params: LoginRequest): Promise<Result<User>> {
		try {
			const response = await this.fetchAuthed(
				"POST",
				this.urls.api.login(),
				params,
			);
			const data = await response.json();

			if ("status" in data && "message" in data) {
				return failure(data);
			}

			return success(data);
		} catch (error) {
			return failure({
				status: 500,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			});
		}
	}

	/**
	 * sign up for a new Discuit account. Note that due to the requirement of a
	 * reCAPTCHA token, this method won't work (we don't think).
	 */
	async signup(params: SignupRequest): Promise<Result<User>> {
		try {
			const response = await this.fetchAuthed(
				"POST",
				this.urls.api.signup(),
				params,
			);
			const data = await response.json();

			if ("status" in data && "message" in data) {
				return failure(data);
			}

			return success(data);
		} catch (error) {
			return failure({
				status: 500,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			});
		}
	}

	async getUser(username: string): Promise<Result<UserModel>> {
		try {
			const response = await this.fetchAuthed(
				"GET",
				this.urls.api.user(username),
			);
			const data = await response.json();

			if ("status" in data && "message" in data) {
				return failure(data);
			}

			return success(new UserModel(this, data));
		} catch (error) {
			return failure({
				status: 500,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			});
		}
	}

	async getCurrentUser(): Promise<Result<User>> {
		try {
			const response = await this.fetchAuthed("GET", this.urls.api.self());
			const data = await response.json();

			if ("status" in data && "message" in data) {
				return failure(data);
			}

			return success(data);
		} catch (error) {
			return failure({
				status: 500,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			});
		}
	}

	async getPosts(
		options: {
			feed?: "home" | "all" | "community";
			communityId?: string;
			sort?:
				| "latest"
				| "hot"
				| "activity"
				| "day"
				| "week"
				| "month"
				| "year"
				| "all";
			filter?: "all" | "deleted" | "locked";
			next?: string;
			limit?: number;
		} = {},
	): Promise<Result<{ posts: PostModel[], next?: string }>> {
		try {
			const params: Record<string, string> = {};
			if (options.feed) params.feed = options.feed;
			if (options.communityId) params.communityId = options.communityId;
			if (options.sort) params.sort = options.sort;
			if (options.filter) params.filter = options.filter;
			if (options.next) params.next = options.next;
			if (options.limit) params.limit = options.limit.toString();

			const response = await this.fetchAuthed(
				"GET",
				this.urls.api.posts(params),
			);
			const data = await response.json();

			if ("status" in data && "message" in data) {
				return failure(data);
			}

			const posts = data.posts.map((post: Post) => new PostModel(this, post));
			return success({ posts, next: data.next });
		} catch (error) {
			return failure({
				status: 500,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			});
		}
	}

	async createPost(options: CreatePostRequest): Promise<Result<PostModel>> {
		try {
			const response = await this.fetchAuthed(
				"POST",
				this.urls.api.posts(),
				options,
			);
			const data = await response.json();

			if ("status" in data && "message" in data) {
				return failure(data);
			}

			return success(new PostModel(this, data));
		} catch (error) {
			return failure({
				status: 500,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			});
		}
	}

	async getPost(
		publicId: string,
		fetchCommunity = false,
	): Promise<Result<PostModel>> {
		try {
			const response = await this.fetchAuthed(
				"GET",
				this.urls.api.post(publicId, fetchCommunity),
			);
			const data = await response.json();

			if ("status" in data && "message" in data) {
				return failure(data);
			}

			return success(new PostModel(this, data));
		} catch (error) {
			return failure({
				status: 500,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			});
		}
	}

	async getCommunity(
		idOrName: string,
		byName = false,
	): Promise<Result<Community>> {
		try {
			const response = await this.fetchAuthed(
				"GET",
				this.urls.api.community(idOrName, byName),
			);
			const data = await response.json();

			if ("status" in data && "message" in data) {
				return failure(data);
			}

			return success(data);
		} catch (error) {
			return failure({
				status: 500,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
			});
		}
	}

	async initSession(): Promise<void> {
		const response = await fetch(this.urls.api.initial(), {
			credentials: "include",
		});

		this.csrfToken = response.headers.get("csrf-token");

		const setCookieHeader = response.headers.get("set-cookie");
		if (setCookieHeader) {
			setCookieHeader.split(", ").forEach((cookieStr) => {
				const [cookiePart] = cookieStr.split(";");
				const [key, value] = cookiePart.split("=");
				if (key && value) this.cookies[key.trim()] = value;
			});
		}
	}

	async fetchAuthed(
		method: string,
		endpoint: string,
		body?: unknown,
	): Promise<Response> {
		if (!this.csrfToken) {
			await this.initSession();
		}

		const headers: Record<string, string> = {
			"Content-Type": "application/json",
		};

		if (this.csrfToken) {
			headers["X-Csrf-Token"] = this.csrfToken;
		}

		if (Object.keys(this.cookies).length > 0) {
			headers["Cookie"] = Object.entries(this.cookies)
				.map(([k, v]) => `${k}=${v}`)
				.join("; ");
		}

		return fetch(endpoint, {
			method,
			headers,
			body: body ? JSON.stringify(body) : undefined,
			credentials: "include",
		});
	}
}
