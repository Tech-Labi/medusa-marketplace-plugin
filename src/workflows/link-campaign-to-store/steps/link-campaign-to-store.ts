import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { Link } from "@medusajs/framework/modules-sdk";

type LinkCampaignToStoreStepInput = {
  campaignId: string;
  storeId: string;
};

export const linkCampaignToStoreStep = createStep(
  "link-campaign-to-store",
  async (
    { campaignId, storeId }: LinkCampaignToStoreStepInput,
    { container }
  ) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    const linkArray = link.create({
      [Modules.PROMOTION]: {
        campaign_id: campaignId,
      },
      [Modules.STORE]: {
        store_id: storeId,
      },
    });

    return new StepResponse(linkArray, {
      campaignId,
      storeId,
    });
  },
  async ({ campaignId, storeId }, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    link.dismiss({
      [Modules.PROMOTION]: {
        campaign_id: campaignId,
      },
      [Modules.STORE]: {
        store_id: storeId,
      },
    });
  }
);
