import { createCollectionsWorkflow } from "@medusajs/medusa/core-flows";
import { StoreDTO } from "@medusajs/framework/types";
import { linkProductCollectionToStoreWorkflow } from "../link-product-collection-to-store";

createCollectionsWorkflow.hooks.collectionsCreated(async ({ collections }, { container }) => {
  console.log("HOOK collectionsCreated", collections);

  const currentStore = container.resolve("currentStore") as Pick<StoreDTO, 'id'>;
  await Promise.all(
    collections.map(({ id }) =>
      linkProductCollectionToStoreWorkflow(container).run({
        input: {
          collectionId: id,
          storeId: currentStore.id,
        },
      })
    )
  );
});
