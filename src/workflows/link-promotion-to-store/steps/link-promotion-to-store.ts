import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { Link } from "@medusajs/framework/modules-sdk";

type LinkPromotionToStoreStepInput = {
  promotionId: string;
  storeId: string;
};

export const linkPromotionToStoreStep = createStep(
  "link-promotion-to-store",
  async (
    { promotionId, storeId }: LinkPromotionToStoreStepInput,
    { container }
  ) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    const linkArray = link.create({
      [Modules.PROMOTION]: {
        promotion_id: promotionId,
      },
      [Modules.STORE]: {
        store_id: storeId,
      },
    });

    return new StepResponse(linkArray, {
      promotionId,
      storeId,
    });
  },
  async ({ promotionId, storeId }, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    link.dismiss({
      [Modules.PROMOTION]: {
        promotion_id: promotionId,
      },
      [Modules.STORE]: {
        store_id: storeId,
      },
    });
  }
);
