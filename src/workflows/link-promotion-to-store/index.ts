import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { linkPromotionToStoreStep } from "./steps/link-promotion-to-store";

export type LinkPromotionToStoreInput = {
  promotionId: string;
  storeId: string;
};

export const linkPromotionToStoreWorkflow = createWorkflow(
  "link-promotion-to-store",
  (input: LinkPromotionToStoreInput) => {
    const promotionStoreLinkArray = linkPromotionToStoreStep(input);

    return new WorkflowResponse({
      promotionStoreLinkArray,
    });
  }
);
