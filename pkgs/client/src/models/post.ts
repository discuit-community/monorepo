import type {
  Post as PostType,
  PostVoteRequest,
  Comment,
} from "@discuit-community/types";
import type { Result } from "../utils/errors";
import { Model } from "./base";
import { CommentModel } from "./comment";
import { UserModel } from "./user";

export class PostModel extends Model {
  private data: PostType;
  private _author: UserModel | null = null;

  constructor(client: any, data: PostType) {
    super(client);
    this.data = data;
  }

  get raw(): PostType {
    return this.data;
  }

  get url(): string {
    return this.client.urls.post({
      publicId: this.data.publicId,
      communityName: this.data.communityName,
    });
  }

  get author(): UserModel | null {
    return this._author;
  }

  async upvote(): Promise<Result<PostModel>> {
    const payload: PostVoteRequest = {
      postId: this.data.id,
      up: true,
    };

    const [data, error] = await this.apiCall<PostType>(
      "POST",
      this.client.urls.api.postVote(),
      payload
    );

    if (error) return [null, error];
    this.data = data;
    return [this, null];
  }

  async downvote(): Promise<Result<PostModel>> {
    const payload: PostVoteRequest = {
      postId: this.data.id,
      up: false,
    };

    const [data, error] = await this.apiCall<PostType>(
      "POST",
      this.client.urls.api.postVote(),
      payload
    );

    if (error) return [null, error];
    this.data = data;
    if (data.author) this._author = new UserModel(this.client, data.author);

    return [this, null];
  }

  async getComments(
    parentId?: string,
    next?: string
  ): Promise<Result<CommentModel[]>> {
    const endpoint = this.client.urls.api.comments(
      this.data.publicId,
      parentId,
      next
    );

    const [data, error] = await this.apiCall<{
      comments: Comment[];
      next: string | null;
    }>("GET", endpoint);

    if (error) return [null, error];

    const comments =
      data.comments?.map((comment) => new CommentModel(this.client, comment)) ||
      [];

    return [comments, null];
  }

  async comment(options: {
    body: string;
    parentCommentId?: string;
  }): Promise<Result<CommentModel>> {
    const [data, error] = await this.apiCall<Comment>(
      "POST",
      this.client.urls.api.comments(this.data.id),
      options
    );

    if (error) return [null, error];
    const comment = new CommentModel(this.client, data);
    return [comment, null];
  }

  async delete(): Promise<Result<PostModel>> {
    const [data, error] = await this.apiCall<PostType>(
      "DELETE",
      this.client.urls.api.post(this.data.publicId)
    );

    if (error) return [null, error];
    this.data = data;
    return [this, null];
  }

  async update(
    options:
      | {
          title: string;
          body?: string;
        }
      | {
          title?: string;
          body: string;
        }
  ): Promise<Result<PostModel>> {
    const [data, error] = await this.apiCall<PostType>(
      "PUT",
      this.client.urls.api.post(this.data.publicId),
      options
    );

    if (error) return [null, error];
    this.data = data;
    return [this, null];
  }
}
