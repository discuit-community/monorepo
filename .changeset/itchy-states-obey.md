---
"@discuit-community/client": minor
---

added UserModel to client package

- added new `UserModel` class to handle user-related operations
- Updated `PostModel` and `CommentModel` to return `UserModel` instances for
  authors
- Added muting functionality for users and communities
- Extended DiscuitUrls to include endpoints for user operations and mutes
