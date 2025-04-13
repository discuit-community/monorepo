import { DiscuitClient } from '@discuit-community/client';
import type { Post } from '@discuit-community/types';

type JetstreamEvent =
  | { type: 'new_post', post: Post }
  | { type: 'post_update', post: Post }
  | { type: 'post_delete', postId: string };

export enum Topic {
  NEW_POSTS = 'new_posts',
  POST_UPDATES = 'post_updates',
  POST_DELETES = 'post_deletes',
  ALL = 'all_posts'
}

export class Jetstream {
  private client: DiscuitClient;
  private server?: ReturnType<typeof Bun.serve>;
  private seenPosts = new Set<string>();
  private pollingInterval: number;

  constructor(options: {
    client: DiscuitClient;
    port?: number;
    pollingInterval?: number;
  }) {
    this.client = options.client;
    this.pollingInterval = options.pollingInterval ?? 1000;
    this.server = this.createServer(options.port ?? 3001);
  }

  private createServer(port: number) {
    return Bun.serve({
      port,
      fetch: (req, server) => {
        if (new URL(req.url).pathname === '/ws') {
          const success = server.upgrade(req, {
            data: { connectedAt: Date.now() }
          });
          return success ? undefined : new Response('upgrade failed', { status: 400 });
        }
        return new Response('400 : connect via websocket instead @ http://localhost:3001/ws', { status: 400 });
      },
      websocket: {
        open: (ws) => {
          ws.subscribe(Topic.ALL);
          console.log(`new connection from ${ws.remoteAddress}`);
        },
        close: (ws) => {
          ws.unsubscribe(Topic.ALL);
        },
        message: () => {},
        perMessageDeflate: true,
        idleTimeout: 300
      }
    });
  }

  /**
   * start polling for new posts
   */
  async start() {
    console.log(`jetstream running on ws://${this.server?.hostname}:${this.server?.port}/ws`);

    while (true) {
      try {
        const [result, error] = await this.client.getPosts({
          feed: 'all',
          sort: 'latest',
          limit: 20
        });

        if (error) {
          console.error('error fetching posts:', error);
          continue;
        }

        const newPosts = result.filter(post => !this.seenPosts.has(post.raw.id))

        newPosts.forEach(post => this.handleNewPost(post.raw));
        if (newPosts.length > 0) console.log(`  > received ${newPosts.length} new posts`);
        else console.write(`\r  > no new posts @ ${new Date().toLocaleString()}`);

        if (this.seenPosts.size > 1000) {
          const recentIds = [...this.seenPosts].slice(-500);
          this.seenPosts = new Set(recentIds);
        }
      } catch (err) {
        console.error('polling error:', err);
      }

      await Bun.sleep(this.pollingInterval);
    }
  }

  private handleNewPost(post: Post) {
    this.seenPosts.add(post.id);

    const event: JetstreamEvent = { type: 'new_post', post };
    const message = JSON.stringify(event);

    this.server?.publish(Topic.NEW_POSTS, message);
    this.server?.publish(Topic.ALL, message);
  }

  stop() {
    this.server?.stop();
  }
}

const client = new DiscuitClient();
const jetstream = new Jetstream({ client: client });
jetstream.start();

export default jetstream;
