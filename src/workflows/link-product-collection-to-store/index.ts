import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { getStoreStep } from "../link-product-to-store/steps/get-store";
import { linkProductCollectionToStoreStep } from "./steps/link-product-collection-to-store";

export type LinkProductCollectionToStoreInput = {
  collectionId: string;
  userId: string;
};

export const linkProductCollectionToStoreWorkflow = createWorkflow(
  "link-product-collection-to-store",
  (input: LinkProductCollectionToStoreInput) => {
    const store = getStoreStep(input.userId);

    const collectionStoreLinkArray = linkProductCollectionToStoreStep({
      collectionId: input.collectionId,
      storeId: store.id,
    });

    return new WorkflowResponse({
      collectionStoreLinkArray,
      store,
    });
  }
);
