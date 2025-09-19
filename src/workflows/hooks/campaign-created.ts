import { createCampaignsWorkflow } from "@medusajs/medusa/core-flows";
import { StoreDTO } from "@medusajs/framework/types";
import { linkCampaignToStoreWorkflow } from "../link-campaign-to-store";

createCampaignsWorkflow.hooks.campaignsCreated(
  async ({ campaigns, additional_data }, { container }) => {
    const currentStore = container.resolve("currentStore") as StoreDTO;

    await Promise.all(
      campaigns.map(({ id }) =>
        linkCampaignToStoreWorkflow(container).run({
          input: {
            campaignId: id,
            storeId: currentStore.id,
          },
        })
      )
    );
  }
);
