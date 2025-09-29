import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { linkCampaignToStoreStep } from "./steps/link-campaign-to-store";

export type LinkCampaignToStoreInput = {
  campaignId: string;
  storeId: string;
};

export const linkCampaignToStoreWorkflow = createWorkflow(
  "link-campaign-to-store",
  (input: LinkCampaignToStoreInput) => {
    const campaignStoreLinkArray = linkCampaignToStoreStep(input);

    return new WorkflowResponse({
      campaignStoreLinkArray,
    });
  }
);
