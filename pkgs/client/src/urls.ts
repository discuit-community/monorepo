export class DiscuitUrls {
	private baseUrl: string;
	private apiUrl: string;

	constructor(
		options: {
			baseUrl?: string;
			apiUrl?: string;
		} = {},
	) {
		this.baseUrl = options.baseUrl ?? "https://discuit.org";
		this.apiUrl = options.apiUrl ?? `${this.baseUrl}/api`;
	}

	post(options: {
		publicId: string;
		communityName: string;
		includeHost?: boolean;
	}): string {
		const { publicId, communityName, includeHost = true } = options;

		const path = `/${communityName}/post/${publicId}`;
		return includeHost ? `${this.baseUrl}${path}` : path;
	}

	community(options: {
		name: string;
		includeHost?: boolean;
	}): string {
		const { name, includeHost = true } = options;
		const path = `/${name}`;
		return includeHost ? `${this.baseUrl}${path}` : path;
	}

	user(options: {
		username: string;
		includeHost?: boolean;
	}): string {
		const { username, includeHost = true } = options;
		const path = `/@${username}`;
		return includeHost ? `${this.baseUrl}${path}` : path;
	}

	comment(options: {
		postPublicId: string;
		commentId: string;
		communityName: string;
		includeHost?: boolean;
	}): string {
		const {
			postPublicId,
			commentId,
			communityName,
			includeHost = true,
		} = options;

		let path = this.post({
			publicId: postPublicId,
			communityName,
			includeHost: false,
		});

		path += `/${commentId}`;

		return includeHost ? `${this.baseUrl}${path}` : path;
	}

	api = {
		base: (): string => this.apiUrl,
		login: (): string => `${this.apiUrl}/_login`,
		signup: (): string => `${this.apiUrl}/_signup`,
		initial: (): string => `${this.apiUrl}/_initial`,
		user: (): string => `${this.apiUrl}/_user`,
		posts: (params?: Record<string, string>): string => {
			let url = `${this.apiUrl}/posts`;
			if (params) {
				const searchParams = new URLSearchParams();
				Object.entries(params).forEach(([key, value]) => {
					searchParams.append(key, value);
				});
				url += `?${searchParams.toString()}`;
			}
			return url;
		},
		post: (publicId: string, fetchCommunity?: boolean): string => {
			let url = `${this.apiUrl}/posts/${publicId}`;
			if (fetchCommunity) {
				url += "?fetchCommunity=true";
			}
			return url;
		},
		community: (communityId: string, byName?: boolean): string => {
			let url = `${this.apiUrl}/communities/${communityId}`;
			if (byName) {
				url += "?byName=true";
			}
			return url;
		},
		comment: (postId: string, commentId: string): string => {
			return `${this.apiUrl}/posts/${postId}/comments/${commentId}`;
		},
		comments: (
			postPublicId: string,
			parentId?: string,
			next?: string,
		): string => {
			let url = `${this.apiUrl}/posts/${postPublicId}/comments`;
			const params = new URLSearchParams();

			if (parentId) params.append("parentId", parentId);
			if (next) params.append("next", next);

			const paramsString = params.toString();
			if (paramsString) url += `?${paramsString}`;

			return url;
		},
		postVote: (): string => `${this.apiUrl}/_postVote`,
		commentVote: (): string => `${this.apiUrl}/_commentVote`,
		lists: {
			items: (listId: string): string => `${this.apiUrl}/lists/${listId}/items`,
		},
	};
}

export default DiscuitUrls;
