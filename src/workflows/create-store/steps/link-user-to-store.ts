import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { Link } from "@medusajs/framework/modules-sdk";

type LinkUserToStoreStepInput = {
  userId: string;
  storeId: string;
};

export const linkUserToStoreStep = createStep(
  "link-user-to-store",
  async ({ userId, storeId }: LinkUserToStoreStepInput, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    const linkArray = link.create({
      [Modules.USER]: {
        user_id: userId,
      },
      [Modules.STORE]: {
        store_id: storeId,
      },
    });

    return new StepResponse(linkArray, {
      userId,
      storeId,
    });
  },
  async ({ userId, storeId }, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    link.dismiss({
      [Modules.USER]: {
        user_id: userId,
      },
      [Modules.STORE]: {
        store_id: storeId,
      },
    });
  }
);
