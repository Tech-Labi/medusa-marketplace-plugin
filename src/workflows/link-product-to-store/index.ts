import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { linkProductToStoreStep } from "./steps/link-product-to-store";

export type LinkProductToStoreInput = {
  productId: string;
  storeId: string;
};

export const linkProductToStoreWorkflow = createWorkflow("link-product-to-store", (input: LinkProductToStoreInput) => {
  const productStoreLinkArray = linkProductToStoreStep({
    productId: input.productId,
    storeId: input.storeId,
  });

  return new WorkflowResponse({
    productStoreLinkArray,
    store: { id: input.storeId },
  });
});
