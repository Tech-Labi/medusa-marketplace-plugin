import { createCollectionsWorkflow } from "@medusajs/medusa/core-flows";
import { UserDTO } from "@medusajs/framework/types";
import { linkProductCollectionToStoreWorkflow } from "../link-product-collection-to-store";

createCollectionsWorkflow.hooks.collectionsCreated(
  async ({ collections }, { container }) => {
    console.log("HOOK collectionsCreated", collections);

    const loggedInUser = container.resolve("loggedInUser") as UserDTO;
    await Promise.all(
      collections.map(({ id }) =>
        linkProductCollectionToStoreWorkflow(container).run({
          input: {
            collectionId: id,
            userId: loggedInUser.id,
          },
        })
      )
    );
  }
);
