import type { Image, ImageUpload } from './image';

/**
 * Login request body for `/_login` endpoint
 */
export type LoginRequest = {
  /** Username of the user to log in */
  username: string;
  /** Password for authentication */
  password: string;
};

/**
 * Signup request body for `/_signup` endpoint.
 * You won't be able to use this endpoint, as it requires a valid reCAPTCHA
 * token that can only be obtained from the client-side JavaScript code on
 * discuit.org.
 */
export type SignupRequest = {
  /** Username for the new account */
  username: string;
  /** Email address for the new account */
  email: string;
  /** Password for the new account */
  password: string;
  /** reCAPTCHA v2 token */
  captchaToken: string;
};

/**
 * Join community request body for `/_joinCommunity` endpoint
 */
export type JoinCommunityRequest = {
  /** ID of the community to join or leave */
  communityId: string;
  /** Set to true to leave the community, false to join */
  leave: boolean;
};

/**
 * Vote on a post request body for `/_postVote` endpoint
 */
export type PostVoteRequest = {
  /** ID of the post to vote on */
  postId: string;
  /** true for upvote, false for downvote */
  up: boolean;
};

/**
 * Vote on a comment request body for `/_commentVote` endpoint
 */
export type CommentVoteRequest = {
  /** ID of the comment to vote on */
  commentId: string;
  /** true for upvote, false for downvote */
  up: boolean;
};

/**
 * Create post request body for `/posts` endpoint
 */
export type CreatePostRequest = {
  /** Post type - defaults to "text" if not specified */
  type?: "text" | "image" | "link";
  /** Post title - must be at least 3 characters */
  title: string;
  /** URL for link posts */
  url?: string;
  /** Body content for text posts */
  body?: string;
  /** Name of the community to post in */
  community: string;
  /** In what capacity the user is posting - defaults to "normal" if empty */
  userGroup?: "normal" | "admins" | "mods" | "";
  /** ID of an uploaded image (DEPRECATED) */
  imageId?: string;
  /** Array of image uploads for image posts */
  images?: ImageUpload[] | null;
};

/**
 * Update post request body for `/posts/{postId}` endpoint
 */
export type UpdatePostRequest = {
  /** New title for the post */
  title?: string;
  /** New body content for the post (text posts only) */
  body?: string;
};

/**
 * Create comment request body for `/posts/{postId}/comments` endpoint
 */
export type CreateCommentRequest = {
  /** ID of the parent comment, or null for top-level comments */
  parentCommentId: string | null;
  /** Content of the comment */
  body: string;
};

/**
 * Update comment request body for `/posts/{postId}/comments/{commentId}` endpoint
 */
export type UpdateCommentRequest = {
  /** New content for the comment */
  body: string;
};

/**
 * Update community request body for `/communities/{communityId}` endpoint
 */
export type UpdateCommunityRequest = {
  /** Whether the community contains NSFW content */
  nsfw?: boolean | null;
  /** Community description */
  about?: string | null;
  /** Whether posting is restricted to moderators only */
  postingRestricted?: boolean | null;
};

/**
 * Add moderator request body for `/communities/{communityId}/mods` endpoint
 */
export type AddModeratorRequest = {
  /** Username of the user to add as moderator */
  username: string;
};

/**
 * Create community rule request body for `/communities/{communityId}/rules` endpoint
 */
export type CreateCommunityRuleRequest = {
  /** Title of the rule */
  rule: string;
  /** Description of the rule */
  description: string;
};

/**
 * Update community rule request body for `/communities/{communityId}/rules/{ruleId}` endpoint
 */
export type UpdateCommunityRuleRequest = {
  /** Title of the rule */
  rule?: string | null;
  /** Description of the rule */
  description?: string | null;
  /** Index/ordering of the rule */
  zIndex?: number | null;
};

/**
 * Create list request body for `/users/{username}/lists` endpoint
 */
export type CreateListRequest = {
  /** Internal name of the list */
  name: string;
  /** Display name of the list */
  displayName: string;
  /** Description of the list */
  description: string | null;
  /** Whether the list is public */
  public: boolean;
};

/**
 * Update list request body for `/users/{username}/lists/{listname}` endpoint
 */
export type UpdateListRequest = {
  /** Internal name of the list */
  name?: string;
  /** Display name of the list */
  displayName?: string;
  /** Description of the list */
  description?: string | null;
  /** Whether the list is public */
  public?: boolean;
  /** Sorting order for the list */
  sort?: "addedDsc" | "addedAsc" | "createdDsc" | "createdAsc";
};

/**
 * Add list item request body for `/users/{username}/lists/{listname}/items` endpoint
 */
export type AddListItemRequest = {
  /** ID of the post or comment to add to the list */
  targetId: string;
  /** Type of the target item */
  targetType: "post" | "comment";
};

/**
 * Remove list item request body for `/users/{username}/lists/{listname}/items` DELETE endpoint
 */
export type RemoveListItemRequest = {
  /** ID of the post or comment to remove from the list */
  targetId: string;
  /** Type of the target item */
  targetType: "post" | "comment";
};

/**
 * Update profile settings request body for `/_settings?action=updateProfile` endpoint
 */
export type UpdateProfileRequest = {
  /** User's about me text */
  aboutMe: string;
  /** Whether upvote notifications are turned off */
  upvoteNotificationsOff: boolean;
  /** Whether reply notifications are turned off */
  replyNotificationsOff: boolean;
  /** The feed to show on homepage */
  homeFeed: "all" | "subscriptions";
  /** Whether to remember feed sort preference */
  rememberFeedSort: boolean;
  /** Whether embeds are turned off */
  embedsOff: boolean;
  /** User's email address */
  email: string;
  /** Whether to hide user profile pictures */
  hideUserProfilePictures: boolean;
};

/**
 * Change password request body for `/_settings?action=changePassword` endpoint
 */
export type ChangePasswordRequest = {
  /** Current password */
  password: string;
  /** New password */
  newPassword: string;
  /** New password confirmation */
  repeatPassword: string;
};
