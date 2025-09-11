import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { Link } from "@medusajs/framework/modules-sdk";

type LinkStockLocationStepInput = {
  locationId: string;
  fulfillmentProviderId: string;
};

export const linkStockLocationToFulfilmentProviderStep = createStep(
  "link-stock-location-to-fulfillment-provider",
  async ({ locationId, fulfillmentProviderId }: LinkStockLocationStepInput, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);
    const linkArray = link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: locationId,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: fulfillmentProviderId,
      },
    });

    return new StepResponse(linkArray, {
      locationId,
      fulfillmentProviderId,
    });
  },
  async ({ locationId, fulfillmentProviderId }, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    link.dismiss({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: locationId,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: fulfillmentProviderId,
      },
    });
  }
);
