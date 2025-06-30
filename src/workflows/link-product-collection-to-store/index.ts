import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { linkProductCollectionToStoreStep } from "./steps/link-product-collection-to-store";

export type LinkProductCollectionToStoreInput = {
  collectionId: string;
  storeId: string;
};

export const linkProductCollectionToStoreWorkflow = createWorkflow(
  "link-product-collection-to-store",
  (input: LinkProductCollectionToStoreInput) => {
    const collectionStoreLinkArray = linkProductCollectionToStoreStep({
      collectionId: input.collectionId,
      storeId: input.storeId,
    });

    return new WorkflowResponse({
      collectionStoreLinkArray,
      store: { id: input.storeId },
    });
  }
);
