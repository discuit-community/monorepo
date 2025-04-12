export type BadRequestErrorCode =
  | "already-admin"
  | "already-not-admin"
  | "already_logged_in"
  | "already-voted"
  | "bad_badge_id"
  | "bad_event"
  | "comment-max-depth-reached"
  | "comment-reply-to-deleted"
  | "empty_username"
  | "file_size_exceeded"
  | "invalid_action"
  | "invalid-community-name"
  | "invalid_cursor"
  | "invalid_expires"
  | "invalid_filter"
  | "invalid_http_method"
  | "invalid_id"
  | "invalid_image_id"
  | "invalid_json"
  | "invalid_mute_type"
  | "invalid_page"
  | "invalid-password"
  | "invalid_post_type"
  | "invalid_report_type"
  | "invalid-set"
  | "invalid-sort"
  | "invalid-url"
  | "invalid-username"
  | "no_username"
  | "password_not_match"
  | "post/title-too-short"
  | "post-type/unsupported"
  | "unsupported_action"
  | "user/invalid-group";

export type NotFoundErrorCode =
  | "badge_type_not_found"
  | "comment_not_found"
  | "community/not-found"
  | "image-not-found"
  | "notif_not_found"
  | "post/not-found"
  | "rule_not_found"
  | "rules_not_found"
  | "user_not_found";

export type APIError = {
  /** HTTP status code */
  status: number;
  /** Custom error code that provides more specific information about the error */
  code?: BadRequestErrorCode | NotFoundErrorCode | string;
  /** Human readable error message (could be an empty string) */
  message: string;
};
