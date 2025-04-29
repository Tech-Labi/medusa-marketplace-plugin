import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { Link } from "@medusajs/framework/modules-sdk";

type LinkProductCollectionToStoreStepInput = {
  collectionId: string;
  storeId: string;
};

export const linkProductCollectionToStoreStep = createStep(
  "link-product-collection-to-store",
  async (
    { collectionId, storeId }: LinkProductCollectionToStoreStepInput,
    { container }
  ) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    const linkArray = link.create({
      [Modules.PRODUCT]: {
        product_collection_id: collectionId,
      },
      [Modules.STORE]: {
        store_id: storeId,
      },
    });

    return new StepResponse(linkArray, {
      collectionId,
      storeId
    });
  },
  async ({ collectionId, storeId }, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    link.dismiss({
      [Modules.PRODUCT]: {
        product_collection_id: collectionId,
      },
      [Modules.STORE]: {
        store_id: storeId,
      },
    });
  }
);
