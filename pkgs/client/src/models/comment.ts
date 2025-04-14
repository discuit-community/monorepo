import type {
  Comment,
  CommentVoteRequest,
  List,
  ListResponses,
} from "@discuit-community/types";
import { Model } from "./base";
import type { Result } from "../utils/errors";
import { UserModel } from "./user";

export class CommentModel extends Model {
  private data: Comment;
  private _author: UserModel | null = null;

  constructor(client: any, data: Comment) {
    super(client);
    this.data = data;
  }

  get raw(): Comment {
    return this.data;
  }

  get url(): string {
    return this.client.urls.comment({
      postPublicId: this.data.postPublicId,
      commentId: this.data.id,
      communityName: this.data.communityName,
    });
  }

  get author(): UserModel | null {
    return this._author;
  }

  async upvote(): Promise<Result<CommentModel>> {
    if (this.data.userVotedUp) return [this, null];

    const payload: CommentVoteRequest = {
      commentId: this.data.id,
      up: true,
    };

    const [data, error] = await this.apiCall<Comment>(
      "POST",
      this.client.urls.api.commentVote(),
      payload
    );

    if (error) return [null, error];
    if (data.author) this._author = new UserModel(this.client, data.author);
    this.data = data;
    return [this, null];
  }

  async downvote(): Promise<Result<CommentModel>> {
    if (this.data.userVoted && !this.data.userVotedUp) return [this, null];

    const payload: CommentVoteRequest = {
      commentId: this.data.id,
      up: false,
    };

    const [data, error] = await this.apiCall<Comment>(
      "POST",
      this.client.urls.api.commentVote(),
      payload
    );

    if (error) return [null, error];
    this.data = data;
    return [this, null];
  }

  async reply(body: string): Promise<Result<CommentModel>> {
    const [data, error] = await this.apiCall<Comment>(
      "POST",
      this.client.urls.api.comments(this.data.postPublicId),
      {
        parentCommentId: this.data.id,
        body,
      }
    );

    if (error) return [null, error];
    return [new CommentModel(this.client, data), null];
  }

  async update(body: string): Promise<Result<CommentModel>> {
    const endpoint = `${this.client.urls.api.comments(
      this.data.postPublicId
    )}/${this.data.id}`;

    const [data, error] = await this.apiCall<Comment>("PUT", endpoint, {
      body,
    });

    if (error) return [null, error];
    this.data = data;
    return [this, null];
  }

  async save(listId: string): Promise<Result<CommentModel>> {
    const endpoint = `${this.client.urls.api.lists.items(listId)}`;

    const [_data, error] = await this.apiCall<ListResponses.GetListItems>(
      "POST",
      endpoint,
      {
        targetType: "comment",
        targetId: this.data.id,
      }
    );

    if (error) return [null, error];
    return [this, null];
  }

  async unsave(listId: string): Promise<Result<CommentModel>> {
    const endpoint = `${this.client.urls.api.lists.items(listId)}`;

    const [_data, error] = await this.apiCall<ListResponses.GetListItems>(
      "DELETE",
      endpoint,
      {
        targetType: "comment",
        targetId: this.data.id,
      }
    );

    if (error) return [null, error];
    return [this, null];
  }

  async delete(): Promise<Result<CommentModel>> {
    const endpoint = `${this.client.urls.api.comments(
      this.data.postPublicId
    )}/${this.data.id}`;

    const [data, error] = await this.apiCall<Comment>("DELETE", endpoint);

    if (error) return [null, error];
    this.data = data;
    return [this, null];
  }
}
