# @discuit-community/client

## 0.4.1

### Patch Changes

- Updated dependencies [6ac79c0]
  - @discuit-community/types@0.2.0

## 0.4.0

### Minor Changes

- 882dea6: return pagination cursor in getPosts method

## 0.3.3

### Patch Changes

- 4a5d373: revert using non-public id for Comment method on PostModel

## 0.3.2

### Patch Changes

- d87c5ee: fix: fix Comment method on PostModel using the publicId

## 0.3.0

### Minor Changes

- 97fec00: added UserModel to client package

  - added new `UserModel` class to handle user-related operations
  - updated `PostModel` and `CommentModel` to return `UserModel` instances for
    authors
  - extended `DiscuitUrls` to include endpoints for user operations and mutes
