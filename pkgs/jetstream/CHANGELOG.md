# @discuit-community/jetstream

## 0.1.0

### Minor Changes

- 3a5ba36: refactor: split jetstream into core event emitter and websocket server

  - extracted core functionality into an `EventEmitter`-based class
  - created separate `JetstreamServer` class for ws functionality
