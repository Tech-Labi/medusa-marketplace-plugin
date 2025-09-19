import {
  createWorkflow,
  transform,
  when,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { getStoreStep } from "../link-product-to-store/steps/get-store";
import { linkCampaignToStoreStep } from "./steps/link-campaign-to-store";

export type LinkCampaignToStoreInput = {
  campaignId: string;
  storeId?: string;
  userId?: string;
};

export const linkCampaignToStoreWorkflow = createWorkflow(
  "link-campaign-to-store",
  (input: LinkCampaignToStoreInput) => {
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

    const campaignStoreLinkArray = linkCampaignToStoreStep({
      campaignId: input.campaignId,
      storeId,
    });

    return new WorkflowResponse({
      campaignStoreLinkArray,
    });
  }
);
