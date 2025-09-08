import { Modules } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";

export const createFulfillmentSetsStep = createStep(
  "create-fulfillment-sets",
  async (_, { container }) => {
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
    const existingFulfillmentSet = await fulfillmentModuleService.listFulfillmentSets({
      name: "European Warehouse delivery",
    });
    if (existingFulfillmentSet.length > 0) {
      return new StepResponse({ fulfillmentSet: existingFulfillmentSet[0] }, { fulfillmentSetId: null });
    }
    const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "European Warehouse delivery",
      type: "shipping",
      service_zones: [
        {
          name: "Europe",
          geo_zones: [
            {
              country_code: "gb",
              type: "country",
            },
            {
              country_code: "de",
              type: "country",
            },
            {
              country_code: "dk",
              type: "country",
            },
            {
              country_code: "se",
              type: "country",
            },
            {
              country_code: "fr",
              type: "country",
            },
            {
              country_code: "es",
              type: "country",
            },
            {
              country_code: "it",
              type: "country",
            },
          ],
        },
      ],
    });
    return new StepResponse({ fulfillmentSet: fulfillmentSet }, { fulfillmentSetId: fulfillmentSet.id });
  },
  async (data: { fulfillmentSetId: string | null }, { container }) => {
    if (!data?.fulfillmentSetId) {
      return;
    }
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);

    if (data?.fulfillmentSetId) {
      await fulfillmentModuleService.deleteFulfillmentSets([data.fulfillmentSetId]);
    }
  }
);
