import type { APIError } from "@discuit-community/types";
import { type Result, success, failure } from "../utils/errors";
import type { DiscuitClient } from "../client";

export abstract class Model {
	protected client: DiscuitClient;

	constructor(client: DiscuitClient) {
		this.client = client;
	}

	protected async apiCall<T>(
		method: string,
		endpoint: string,
		body?: unknown,
	): Promise<Result<T>> {
		try {
			const response = await this.client.fetchAuthed(method, endpoint, body);
			const data = await response.json();

			if (data && "status" in data && "message" in data)
				return failure(data as APIError);

			return success(data as T);
		} catch (err) {
			return failure({
				status: 500,
				message: err instanceof Error ? err.message : "unknown error occurred",
			});
		}
	}
}
