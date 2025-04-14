---
"@discuit-community/jetstream": minor
---

refactor: split jetstream into core event emitter and websocket server

- extracted core functionality into an `EventEmitter`-based class
- created separate `JetstreamServer` class for ws functionality
