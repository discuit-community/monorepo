---
"@discuit-community/client": minor
---

added UserModel to client package

- added new `UserModel` class to handle user-related operations
- updated `PostModel` and `CommentModel` to return `UserModel` instances for
  authors
- extended `DiscuitUrls` to include endpoints for user operations and mutes
