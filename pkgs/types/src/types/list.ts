import type { Post } from './post';
import type { Comment } from './post';

export type List = {
  id: number;
  userId: string;
  username: string;
  name: string;
  displayName: string;
  description: string | null;
  public: boolean;
  numItems: number;
  sort: "addedDsc" | "addedAsc" | "createdDsc" | "createdAsc";
  createdAt: string;
  lastUpdatedAt: string;
};

export type ListItem = {
  id: number;
  listId: number;
  targetType: "post" | "comment";
  targetId: string;
  createdAt: string;
  targetItem: Post | Comment;
};
