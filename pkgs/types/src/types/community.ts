import type { Image } from './image';
import type { User } from './user';

export type CommunityRule = {
  id: number;
  rule: string;
  description: string | null;
  communityId: string;
  zIndex: number;
  createdBy: string;
  createdAt: string;
};

export type Community = {
  id: string;
  userId: string;
  name: string;
  nsfw: boolean;
  about: string | null;
  noMembers: number;
  proPic: Image;
  bannerImage: Image;
  postingRestricted: boolean;
  createdAt: string;
  deletedAt: string | null;
  isDefault?: boolean;
  userJoined: boolean | null;
  userMod: boolean;
  mods: User[];
  rules: CommunityRule[];
  ReportDetails?: {
    noReports: number;
    noPostReports: number;
    noCommentReports: number;
  } | null;
};
