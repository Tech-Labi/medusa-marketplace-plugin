import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { Link } from "@medusajs/framework/modules-sdk";

type LinkProductToStoreStepInput = {
  productId: string;
  storeId: string;
};

export const linkProductToStoreStep = createStep(
  "link-product-to-store",
  async (
    { productId, storeId }: LinkProductToStoreStepInput,
    { container }
  ) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    const linkArray = link.create({
      [Modules.PRODUCT]: {
        product_id: productId,
      },
      [Modules.STORE]: {
        store_id: storeId,
      },
    });

    return new StepResponse(linkArray, {
      productId,
      storeId
    });
  },
  async ({ productId, storeId }, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    link.dismiss({
      [Modules.PRODUCT]: {
        product_id: productId,
      },
      [Modules.STORE]: {
        store_id: storeId,
      },
    });
  }
);
