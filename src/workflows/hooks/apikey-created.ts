import { createApiKeysWorkflow } from "@medusajs/medusa/core-flows";
import { StoreDTO, UserDTO } from "@medusajs/framework/types";
import { linkApiKeyToStoreWorkflow } from "../link-apikey-to-store";

createApiKeysWorkflow.hooks.apiKeysCreated(async ({ apiKeys }, { container }) => {
  console.log("HOOK apiKeysCreated", apiKeys);

  const currentStore = container.resolve("currentStore") as StoreDTO;
  await Promise.all(
    apiKeys.map(({ id }) =>
      linkApiKeyToStoreWorkflow(container).run({
        input: {
          apiKeyId: id,
          storeId: currentStore.id,
        },
      })
    )
  );
});
