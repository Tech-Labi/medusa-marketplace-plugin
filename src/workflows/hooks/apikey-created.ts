import { createApiKeysWorkflow } from "@medusajs/medusa/core-flows";
import { StoreDTO } from "@medusajs/framework/types";
import { linkApiKeyToStoreWorkflow } from "../link-apikey-to-store";

createApiKeysWorkflow.hooks.apiKeysCreated(async ({ apiKeys }, { container }) => {
  console.log("HOOK apiKeysCreated", apiKeys);

  let currentStore: Pick<StoreDTO, 'id'> | undefined;

  try {
    currentStore = container.resolve("currentStore") as Pick<StoreDTO, 'id'> | undefined;
    if (!currentStore) {
      console.warn("currentStore is undefined, skipping linking workflow");
      return;
    }
  } catch {
    console.warn("currentStore not found, skipping linking workflow");
    return;
  }
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
