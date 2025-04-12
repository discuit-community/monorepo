import type { User } from './user';
import type { Community } from './community';

export type Mute = {
  id: string;
  type: "user" | "community";
  mutedUserId?: string;
  mutedCommunityId?: string;
  createdAt: string;
  mutedUser?: User;
  mutedCommunity?: Community;
};
