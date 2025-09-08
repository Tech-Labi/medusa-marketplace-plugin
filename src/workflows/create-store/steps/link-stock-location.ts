import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { Link } from "@medusajs/framework/modules-sdk";

type LinkStockLocationStepInput = {
  locationId: string;
};

export const linkStockLocationStep = createStep(
  "link-stock-location",
  async ({ locationId }: LinkStockLocationStepInput, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);
    const linkArray = link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: locationId,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: "manual_manual",
      },
    });

    return new StepResponse(linkArray, {
      locationId,
    });
  },
  async ({ locationId }, { container }) => {
    const link: Link = container.resolve(ContainerRegistrationKeys.LINK);

    link.dismiss({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: locationId,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: "manual_manual",
      },
    });
  }
);
