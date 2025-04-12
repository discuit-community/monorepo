# @discuit-community/types

typescript definitions for the Discuit API.

## overview

this package contains type definitions for data models used in
[Discuit](https://discuit.org)'s API. it's designed to be used as a foundation
for building applications that interact with Discuit.

## usage

you can import specific types for your application:

```typescript
import { Post, Comment, User, Community } from '@discuit-community/types';

// use the types in your function definitions
function displayPost(post: Post) {
  console.log(`${post.title} - by ${post.author?.username}`);
}

// type checking for API responses
async function fetchPosts(): Promise<Post[]> {
  const response = await fetch('https://discuit.org/api/posts');
  const data = await response.json();
  return data.posts;
}
```

## available types

this package includes types for all major Discuit data models:

- **Images**: `Image`, `ImageCopy`, `ImageUpload`
- **Users**: `User`, `Badge`
- **Communities**: `Community`, `CommunityRule`
- **Content**: `Post`, `Comment`
- **Lists**: `List`, `ListItem`
- **Mutes**: `Mute`
- **Notifications**: `Notification`, `NewVotesNotif`, `DeletedPostNotif`,
  `NewCommentNotif`, `CommentReplyNotif`, `NewBadgeNotif`, `ModAddNotif`
- **Reports**: `Report`, `ReportReason`
