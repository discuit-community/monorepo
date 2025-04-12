
  import type { Post } from './post';
  import type { Comment } from './post';
  import type { User } from './user';
  import type { Community } from './community';

  export type NewVotesNotif = {
    noVotes: number;
    targetId: string;
    targetType: "post" | "comment";
    post: Post | Comment;
    comment?: Comment;
  };

  export type DeletedPostNotif = {
    deletedAs: "mods" | "admins";
    post: Post;
    targetId: string;
    targetType: "post" | "comment";
  };

  export type NewCommentNotif = {
    commentAuthor: string;
    commentId: string;
    firstCreatedAt: string;
    noComments: number;
    post: Post;
    postId: string;
  };

  export type CommentReplyNotif = {
    commentAuthor: string;
    commentId: string;
    firstCreatedAt: string;
    noComments: number;
    parentCommitId: string;
    post: Post;
    postId: string;
  };

  export type NewBadgeNotif = {
    badgeType: string;
    user: User;
  };

  export type ModAddNotif = {
    addedBy: string;
    community: Community;
    communityName: string;
  };

  export type Notification = {
    id: number;
    type: "new_comment" | "comment_reply" | "new_votes" | "deleted_post" | "mod_add" | "new_badge";
    notif:
      | NewVotesNotif
      | DeletedPostNotif
      | NewCommentNotif
      | CommentReplyNotif
      | NewBadgeNotif
      | ModAddNotif;
    seen: boolean;
    seenAt: string | null;
    createdAt: string;
  };
