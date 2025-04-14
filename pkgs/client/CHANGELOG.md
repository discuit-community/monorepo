# @discuit-community/client

## 0.3.0

### Minor Changes

- 97fec00: added UserModel to client package

  - added new `UserModel` class to handle user-related operations
  - updated `PostModel` and `CommentModel` to return `UserModel` instances for
    authors
  - extended `DiscuitUrls` to include endpoints for user operations and mutes
