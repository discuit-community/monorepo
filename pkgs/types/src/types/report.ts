import type { Comment, Post } from './post';

export type ReportReason = {
  id: number;
  title: string;
  description: string | null;
};

export type Report = {
  id: number;
  communityId: string;
  postId: string | null;
  reason: string;
  description: string | null;
  reasonId: number;
  type: "post" | "comment";
  targetId: string;
  actionTaken: string | null;
  dealtAt: string | null;
  dealtBy: string | null;
  createdAt: string;
  target: Comment | Post;
};
