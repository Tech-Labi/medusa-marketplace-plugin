import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { Link } from "@medusajs/framework/modules-sdk";

type LinkOrderToStoreStepInput = {
  orderId: string;
  storeId: string;
};

export const linkOrderToStoreStep = createStep(
  "link-order-to-store",
  async ({ orderId, storeId }: LinkOrderToStoreStepInput, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    const linkArray = link.create({
      [Modules.ORDER]: {
        order_id: orderId,
      },
      [Modules.STORE]: {
        store_id: storeId,
      },
    });

    return new StepResponse(linkArray, {
      orderId,
      storeId,
    });
  },
  async ({ orderId, storeId }, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    link.dismiss({
      [Modules.ORDER]: {
        order_id: orderId,
      },
      [Modules.STORE]: {
        store_id: storeId,
      },
    });
  }
);
