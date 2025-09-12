import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { Link } from "@medusajs/framework/modules-sdk";

type LinkStockLocationToFulfillmentStepInput = {
  locationId: string;
  fulfillmentSetId: string;
};

export const linkStockLocationToFulfillmentStep = createStep(
  "link-stock-location-to-fulfillment",
  async ({ locationId, fulfillmentSetId }: LinkStockLocationToFulfillmentStepInput, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    const linkArray = link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: locationId,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSetId,
      },
    });

    return new StepResponse(linkArray, {
      locationId,
      fulfillmentSetId,
    });
  },
  async ({ locationId, fulfillmentSetId }, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    link.dismiss({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: locationId,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSetId,
      },
    });
  }
);
