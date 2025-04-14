import { Jetstream } from "./core";
import { JetstreamServer, Topic } from "./server";
import { DiscuitClient } from "@discuit-community/client";

// Re-export everything
export { Jetstream, JetstreamServer, Topic };

// Main entry point for direct execution
if (import.meta.url === `file://${Bun.main}`) {
  const client = new DiscuitClient();
  await client.initialize();

  const jetstream = new Jetstream({
    client,
    pollingInterval: 1000,
    commentPollingInterval: 1000,
  });

  const server = new JetstreamServer({ jetstream });

  await jetstream.start();

  console.log(`jetstream running on ${server.getInfo().url}`);
}
