# @discuit-community/proxy

a CORS proxy server for making unauthenticated requests to the Discuit API.

## overview

this package provides a simple proxy server that allows client-side
applications to make unauthenticated requests to the Discuit API without
running into CORS restrictions.

## usage

### running locally

```bash
# install dependencies
bun install

# start the proxy server
bun start

# or run in development mode with auto-restart
bun dev
```

the server will start on port 49152 by default. you can change this by setting
the `PORT` environment variable.

### making requests

once the server is running, you can make requests to it:

```js
// instead of fetching from discuit.org/api/posts, fetch from your proxy
fetch('http://localhost:49152/posts?feed=all&sort=latest')
  .then(response => response.json())
  .then(data => {
    console.log('Latest posts:', data);
  });
```

### supported endpoints

only `GET` requests to the following public endpoints are allowed:

- `/posts` - fetch posts
- `/communities` - fetch communities
- `/users` - fetch user information
- `/_initial` - get initial site data

## security note

this proxy only allows access to public endpoints and read-only operations. it
doesn't support making authenticated requests.
