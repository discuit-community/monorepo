# @discuit-community/jetstream

## 2.0.0

### Patch Changes

- Updated dependencies [6ac79c0]
  - @discuit-community/types@0.2.0
  - @discuit-community/client@0.4.1

## 1.0.0

### Patch Changes

- 8d50429: update to latest client vers
- Updated dependencies [882dea6]
  - @discuit-community/client@0.4.0

## 0.3.0

### Minor Changes

- d9394a5: retry failed requests

## 0.2.2

### Patch Changes

- Updated dependencies [4a5d373]
  - @discuit-community/client@0.3.3

## 0.2.1

### Patch Changes

- Updated dependencies [d87c5ee]
  - @discuit-community/client@0.3.2

## 0.2.0

### Minor Changes

- d360c6c: fix: check if posts were made before the server was started

## 0.1.0

### Minor Changes

- 3a5ba36: refactor: split jetstream into core event emitter and websocket server

  - extracted core functionality into an `EventEmitter`-based class
  - created separate `JetstreamServer` class for ws functionality
