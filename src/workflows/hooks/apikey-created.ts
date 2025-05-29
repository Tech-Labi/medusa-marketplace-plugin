import { createApiKeysWorkflow } from "@medusajs/medusa/core-flows";
import { UserDTO } from "@medusajs/framework/types";
import { linkApiKeyToStoreWorkflow } from "../link-apikey-to-store";

createApiKeysWorkflow.hooks.apiKeysCreated(
  async ({ apiKeys }, { container }) => {
    console.log("HOOK apiKeysCreated", apiKeys);

    const loggedInUser = container.resolve("loggedInUser") as UserDTO;

    await Promise.all(
      apiKeys.map(({ id }) =>
        linkApiKeyToStoreWorkflow(container).run({
          input: {
            apiKeyId: id,
            userId: loggedInUser.id,
          },
        })
      )
    );
  }
);
