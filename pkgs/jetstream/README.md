# @discuit-community/jetstream

a real-time websocket for new posts and comments (soon) on discuit.

## usage

### running locally

```bash
# install dependencies
bun install

# start jetstream
bun start

# or run in development mode with auto-restart
bun dev
```

### connecting to the jetstream

clients can connect to jetstream using a WebSocket:

```typescript
const ws = new WebSocket('ws://localhost:3001/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  switch (data.type) {
    case 'new_post':
      console.log('new post:', data.post);
      break;
  }
};
```
