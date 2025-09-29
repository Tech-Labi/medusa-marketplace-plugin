import { createPromotionsWorkflow } from "@medusajs/medusa/core-flows";
import { StoreDTO } from "@medusajs/framework/types";
import { linkPromotionToStoreWorkflow } from "../link-promotion-to-store";
import { linkCampaignToStoreWorkflow } from "../link-campaign-to-store";

createPromotionsWorkflow.hooks.promotionsCreated(
  async ({ promotions, additional_data }, { container }) => {
    const currentStore = container.resolve("currentStore") as Pick<StoreDTO, 'id'>;

    // console.log("[promotionsCreated] hook", { promotions, additional_data });

    await Promise.all(
      promotions.map((promotion) => {
        linkPromotionToStoreWorkflow(container).run({
          input: {
            promotionId: promotion.id,
            storeId: currentStore.id,
          },
        });

        if (promotion.campaign_id) {
          linkCampaignToStoreWorkflow(container).run({
            input: {
              campaignId: promotion.campaign_id,
              storeId: currentStore.id,
            },
          });
        }
      })
    );
  }
);
