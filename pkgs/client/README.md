# @discuit-community/client

typed API client for Discuit.

## overview

this package provides a fully-typed client for interacting with the
[Discuit](https://discuit.org) API. it builds on the type definitions from
`@discuit-community/types` to provide a convenient interface with full TypeScript
support.

## usage

```typescript
import { DiscuitClient } from '@discuit-community/client';

// create a new client
const client = new DiscuitClient();

// initialize (sets cookies for authentication)
await client.initialize();

// get latest posts
const postsResponse = await client.posts.getAll({
  feed: 'all',
  sort: 'latest'
});

// check if we got an error or posts
if ('status' in postsResponse) {
  console.error('Error:', postsResponse.message);
} else {
  console.log('Posts:', postsResponse.posts);
}

// create a post (if authenticated)
const newPost = await client.posts.create({
  title: 'Hello from the discuit-community client!',
  body: 'This post was created using the typed API client.',
  community: 'test'
});

// vote on a post
await client.posts.vote({
  postId: 'some-post-id',
  up: true
});
```

## resources

The client provides access to different API resources:

- `client.posts` - Post operations
- `client.comments` - Comment operations
- `client.communities` - Community operations
- `client.users` - User operations
- `client.lists` - List operations
- `client.notifications` - Notification operations

each resource provides typed methods for interacting with the corresponding API
endpoints.

## authentication

the client uses cookies for authentication, automatically including them in
requests when credentials are set to 'include' (the default). to authenticate:

1. Call `client.initialize()` to get initial cookies
2. Use `client.users.login(username, password)` to log in
