import type { User } from './user';
import type { Community } from './community';
import type { Post } from './post';
import type { Comment } from './post';
import type { List, ListItem } from './list';
import type { Notification } from './notification';
import type { ReportReason, Report } from './report';
import type { APIError } from './error';
import type { Mute } from './mute';

/**
 * Response types for user-related endpoints
 */
export namespace UserResponses {
  /** Response from the /_login endpoint */
  export type Login = User | APIError;

  /** Response from the /_signup endpoint */
  export type Signup = User | APIError;

  /** Response from the /_user endpoint */
  export type GetCurrentUser = User | APIError;

  /** Response from the /users/{username} endpoint */
  export type GetUser = User | APIError;

  /** Response from the /_settings endpoint */
  export type UpdateSettings = User | APIError;
}

/**
 * Response types for community-related endpoints
 */
export namespace CommunityResponses {
  /** Response from the /communities endpoint */
  export type GetCommunities = Community[] | APIError;

  /** Response from the /communities/{communityId} endpoint */
  export type GetCommunity = Community | APIError;

  /** Response from the /communities/{communityId} PUT endpoint */
  export type UpdateCommunity = Community | APIError;

  /** Response from the /_joinCommunity endpoint */
  export type JoinCommunity = Community | APIError;

  /** Response from the /communities/{communityId}/mods endpoint */
  export type GetModerators = User[] | null | APIError;

  /** Response from the /communities/{communityId}/mods POST endpoint */
  export type AddModerator = User[] | APIError;

  /** Response from the /communities/{communityId}/mods/{mod} DELETE endpoint */
  export type RemoveModerator = User | APIError;

  /** Response from the /communities/{communityId}/rules endpoint */
  export type GetRules = Array<Community['rules'][0]> | APIError;

  /** Response from the /communities/{communityId}/rules POST endpoint */
  export type CreateRule = Community['rules'][0] | APIError;

  /** Response from the /communities/{communityId}/rules/{ruleId} PUT endpoint */
  export type UpdateRule = Community['rules'][0] | APIError;

  /** Response from the /communities/{communityId}/rules/{ruleId} DELETE endpoint */
  export type DeleteRule = Community['rules'][0] | APIError;
}

/**
 * Response types for post-related endpoints
 */
export namespace PostResponses {
  /** Response from the /posts endpoint GET */
  export type GetPosts = {
    posts: Post[];
    next: string | null;
  } | APIError;

  /** Response from the /posts endpoint GET with filter parameter */
  export type GetFilteredPosts = {
    noPosts: number;
    limit: number;
    page: number;
    posts: Post[];
  } | APIError;

  /** Response from the /posts endpoint POST */
  export type CreatePost = Post | APIError;

  /** Response from the /posts/{postId} endpoint GET */
  export type GetPost = Post | APIError;

  /** Response from the /posts/{postId} endpoint PUT */
  export type UpdatePost = Post | APIError;

  /** Response from the /posts/{postId} endpoint DELETE */
  export type DeletePost = Post | APIError;

  /** Response from the /_postVote endpoint */
  export type VotePost = Post | APIError;
}

/**
 * Response types for comment-related endpoints
 */
export namespace CommentResponses {
  /** Response from the /posts/{postId}/comments endpoint GET */
  export type GetComments = {
    comments: Comment[] | null;
    next: string | null;
  } | APIError;

  /** Response from the /posts/{postId}/comments endpoint POST */
  export type CreateComment = Comment | APIError;

  /** Response from the /posts/{postId}/comments/{commentId} endpoint PUT */
  export type UpdateComment = Comment | APIError;

  /** Response from the /posts/{postId}/comments/{commentId} endpoint DELETE */
  export type DeleteComment = Comment | APIError;

  /** Response from the /_commentVote endpoint */
  export type VoteComment = Comment | APIError;
}

/**
 * Response types for list-related endpoints
 */
export namespace ListResponses {
  /** Response from the /users/{username}/lists endpoint GET */
  export type GetLists = List[] | APIError;

  /** Response from the /users/{username}/lists endpoint POST */
  export type CreateList = List[] | APIError;

  /** Response from the /users/{username}/lists/{listname} endpoint GET */
  export type GetList = List | APIError;

  /** Response from the /users/{username}/lists/{listname} endpoint PUT */
  export type UpdateList = List | APIError;

  /** Response from the /users/{username}/lists/{listname} endpoint DELETE */
  export type DeleteList = List | APIError;

  /** Response from the /users/{username}/lists/{listname}/items endpoint GET */
  export type GetListItems = {
    items: ListItem[];
    next: string | null;
  } | APIError;

  /** Response from the /users/{username}/lists/{listname}/items endpoint POST */
  export type AddListItem = ListItem | APIError;

  /** Response from the /users/{username}/lists/{listname}/items endpoint DELETE */
  export type RemoveListItem = ListItem | APIError;

  /** Response from the /lists/{listId}/items/{itemId} endpoint DELETE */
  export type RemoveListItemById = ListItem | APIError;

  /** Response from the /lists/_saved_to endpoint GET */
  export type GetSavedToLists = number[] | APIError;
}

/**
 * Response types for notification-related endpoints
 */
export namespace NotificationResponses {
  /** Response from the /notifications endpoint GET */
  export type GetNotifications = {
    count: number;
    newCount: number;
    items: Notification[];
    next: string | null;
  } | APIError;

  /** Response from the /notifications endpoint POST */
  export type UpdateNotifications = {
    success: true;
  } | APIError;

  /** Response from the /notifications/{notificationId} endpoint GET/PUT */
  export type GetOrUpdateNotification = Notification | APIError;

  /** Response from the /notifications/{notificationId} endpoint DELETE */
  export type DeleteNotification = Notification | APIError;
}

/**
 * Response from the /_initial endpoint
 */
export type InitialResponse = {
  reportReasons: ReportReason[];
  user: User | null;
  communities: Community[];
  noUsers: number;
  bannedFrom: string[] | null;
  vapidPublicKey: string;
  mutes: {
    communityMutes: Mute[];
    userMutes: Mute[];
  };
} | APIError;

/**
 * Response from the /push_subscriptions endpoint
 */
export type PushSubscriptionResponse = {
  success: boolean;
} | APIError;

/**
 * Response from the /users/{username}/feed endpoint
 */
export type UserFeedResponse = {
  items: (Post | Comment)[];
  next: string | null;
} | APIError;
