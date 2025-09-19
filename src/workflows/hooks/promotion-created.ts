import { createPromotionsWorkflow } from "@medusajs/medusa/core-flows";
import { StoreDTO } from "@medusajs/framework/types";
import { linkPromotionToStoreWorkflow } from "../link-promotion-to-store";

createPromotionsWorkflow.hooks.promotionsCreated(
  async ({ promotions, additional_data }, { container }) => {
    const currentStore = container.resolve("currentStore") as StoreDTO;

    await Promise.all(
      promotions.map(({ id }) =>
        linkPromotionToStoreWorkflow(container).run({
          input: {
            promotionId: id,
            storeId: currentStore.id,
          },
        })
      )
    );
  }
);
