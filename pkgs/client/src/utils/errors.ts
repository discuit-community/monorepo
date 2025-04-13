import type { APIError } from "@discuit-community/types";

export type Result<T> = [T, null] | [null, APIError];

export function isError<T>(result: Result<T>): result is [null, APIError] {
	return result[1] !== null;
}

export function isSuccess<T>(result: Result<T>): result is [T, null] {
	return result[1] === null;
}

export function success<T>(data: T): Result<T> {
	return [data, null];
}

export function failure<T>(error: APIError): Result<T> {
	return [null, error];
}
