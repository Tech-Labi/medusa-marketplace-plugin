import {
  createWorkflow,
  transform,
  when,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { getStoreStep } from "../link-product-to-store/steps/get-store";
import { linkPromotionToStoreStep } from "./steps/link-promotion-to-store";

export type LinkPromotionToStoreInput = {
  promotionId: string;
  storeId?: string;
  userId?: string;
};

export const linkPromotionToStoreWorkflow = createWorkflow(
  "link-order-to-store",
  (input: LinkPromotionToStoreInput) => {
    const storeIdFromUser = when("check_user_id", input, (input) => {
      return !!input.userId;
    }).then(() => {
      const store = getStoreStep({ userId: input.userId });
      return store.id;
    });

    const storeId = transform(
      { storeId: input.storeId, storeIdFromUser },
      (data) => data.storeId || data.storeIdFromUser
    );

    const promotionStoreLinkArray = linkPromotionToStoreStep({
      promotionId: input.promotionId,
      storeId,
    });

    return new WorkflowResponse({
      promotionStoreLinkArray,
    });
  }
);
