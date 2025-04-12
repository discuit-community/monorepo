import type { Image } from './image';
import type { Community } from './community';

export type Badge = {
  id: number;
  type: string;
};

export type User = {
  id: string;
  username: string;
  email: string | null;
  emailConfirmedAt: string | null;
  aboutMe: string | null;
  points: number;
  isAdmin: boolean;
  proPic: Image | null;
  badges: Badge[];
  noPosts: number;
  noComments: number;
  lastSeenMonth?: string;
  createdAt: string;
  deleted: boolean;
  deletedAt: string | null;
  upvoteNotificationsOff: boolean;
  replyNotificationsOff: boolean;
  homeFeed: "all" | "subscriptions";
  rememberFeedSort: boolean;
  embedsOff: boolean;
  hideUserProfilePictures: boolean;
  bannedAt: string | null;
  isBanned: boolean;
  notificationsNewCount: number;
  moddingList: Community[] | null;
};
