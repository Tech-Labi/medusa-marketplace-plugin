import { createCampaignsWorkflow } from "@medusajs/medusa/core-flows";
import { StoreDTO } from "@medusajs/framework/types";
import { linkCampaignToStoreWorkflow } from "../link-campaign-to-store";

createCampaignsWorkflow.hooks.campaignsCreated(
  async ({ campaigns, additional_data }, { container }) => {
    const currentStore = container.resolve("currentStore") as Pick<StoreDTO, 'id'>;

    // console.log("[campaignsCreated] hook", {
    //   campaigns,
    //   additional_data,
    // });

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
