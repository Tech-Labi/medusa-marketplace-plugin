import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { Link } from "@medusajs/framework/modules-sdk";

type LinkApiKeyToStoreStepInput = {
  apiKeyId: string;
  storeId: string;
};

export const linkApiKeyToStoreStep = createStep(
  "link-apikey-to-store",
  async ({ apiKeyId, storeId }: LinkApiKeyToStoreStepInput, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    const linkArray = link.create({
      [Modules.API_KEY]: {
        api_key_id: apiKeyId,
      },
      [Modules.STORE]: {
        store_id: storeId,
      },
    });

    return new StepResponse(linkArray, {
      apiKeyId,
      storeId,
    });
  },
  async ({ apiKeyId, storeId }, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    link.dismiss({
      [Modules.API_KEY]: {
        api_key_id: apiKeyId,
      },
      [Modules.STORE]: {
        store_id: storeId,
      },
    });
  }
);
