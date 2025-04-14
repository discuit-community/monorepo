import type {
  User,
  UpdateProfileRequest,
  Mute,
  List,
} from "@discuit-community/types";
import { Model } from "./base";
import type { Result } from "../utils/errors";

export class UserModel extends Model {
  private data: User;

  constructor(client: any, data: User) {
    super(client);
    this.data = data;
  }

  get raw(): User {
    return this.data;
  }

  get url(): string {
    return this.client.urls.user({
      username: this.data.username,
    });
  }

  async updateProfile(
    options: Partial<UpdateProfileRequest>
  ): Promise<Result<UserModel>> {
    const [data, error] = await this.apiCall<User>(
      "POST",
      `${this.client.urls.api.base()}/_settings?action=updateProfile`,
      options
    );

    if (error) return [null, error];
    this.data = data;
    return [this, null];
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<Result<UserModel>> {
    const [data, error] = await this.apiCall<User>(
      "POST",
      `${this.client.urls.api.base()}/_settings?action=changePassword`,
      {
        password: currentPassword,
        newPassword: newPassword,
        repeatPassword: newPassword,
      }
    );

    if (error) return [null, error];
    this.data = data;
    return [this, null];
  }

  async getFeed(
    options: { next?: string; limit?: number } = {}
  ): Promise<Result<any>> {
    const params = new URLSearchParams();
    if (options.next) params.append("next", options.next);
    if (options.limit) params.append("limit", options.limit.toString());

    const endpoint = `${this.client.urls.api.base()}/users/${
      this.data.username
    }/feed?${params.toString()}`;

    return await this.apiCall("GET", endpoint);
  }

  async getLists(): Promise<Result<List[]>> {
    const endpoint = `${this.client.urls.api.base()}/users/${
      this.data.username
    }/lists`;
    return await this.apiCall<List[]>("GET", endpoint);
  }

  // Muting functionality
  async getMutes(): Promise<
    Result<{ userMutes: Mute[]; communityMutes: Mute[] }>
  > {
    // We can get this from the _initial endpoint
    const [data, error] = await this.apiCall<any>(
      "GET",
      this.client.urls.api.initial()
    );

    if (error) return [null, error];
    return [data.mutes, null];
  }

  async muteUser(userId: string): Promise<Result<Mute>> {
    const endpoint = `${this.client.urls.api.base()}/mutes`;

    const [data, error] = await this.apiCall<Mute>("POST", endpoint, {
      type: "user",
      targetId: userId,
    });

    if (error) return [null, error];
    return [data, null];
  }

  async unmuteUser(muteId: string): Promise<Result<Mute>> {
    const endpoint = `${this.client.urls.api.base()}/mutes/${muteId}`;

    const [data, error] = await this.apiCall<Mute>("DELETE", endpoint);

    if (error) return [null, error];
    return [data, null];
  }

  async muteCommunity(communityId: string): Promise<Result<Mute>> {
    const endpoint = `${this.client.urls.api.base()}/mutes`;

    const [data, error] = await this.apiCall<Mute>("POST", endpoint, {
      type: "community",
      targetId: communityId,
    });

    if (error) return [null, error];
    return [data, null];
  }

  async unmuteCommunity(muteId: string): Promise<Result<Mute>> {
    const endpoint = `${this.client.urls.api.base()}/mutes/${muteId}`;

    const [data, error] = await this.apiCall<Mute>("DELETE", endpoint);

    if (error) return [null, error];
    return [data, null];
  }

  async isUserMuted(userId: string): Promise<Result<boolean>> {
    const [mutes, error] = await this.getMutes();

    if (error) return [null, error];

    const isMuted = mutes.userMutes.some((mute) => mute.mutedUserId === userId);
    return [isMuted, null];
  }

  async isCommunityMuted(communityId: string): Promise<Result<boolean>> {
    const [mutes, error] = await this.getMutes();

    if (error) return [null, error];

    const isMuted = mutes.communityMutes.some(
      (mute) => mute.mutedCommunityId === communityId
    );
    return [isMuted, null];
  }
}
