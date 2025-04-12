# discuit community

community-maintained toolkit for integrating with Discuit - types, api client,
and realtime capabilities

## about

this project aims to provide a comprehensive set of tools for developers who
want to build applications that integrate with [Discuit](https://discuit.org).
current tooling around Discuit for the typescript ecosystem is very limited,
this project aims to fill that gap.

## packages

this monorepo contains several packages under the `pkgs/` directory:

### `@discuit-community/types`

typescript definitions for Discuit's API responses and requests, enabling full
type safety when working with Discuit data.

### `@discuit-community/client`

a fully typed API client for interacting with Discuit's REST API.

### `@discuit-community/jetstream`

real-time capabilities for Discuit through a websocket server that polls the
API and streams updates.

### `@discuit-community/proxy`

a simple proxy for making *unauthenticated* requests to Discuit's API, working
around CORS limitations.

## copying

`discuit community` and all its packages are licensed under the copyleft GNU
General Public License v3.0. you can find the full text of the license in the
[`COPYING`] file.
