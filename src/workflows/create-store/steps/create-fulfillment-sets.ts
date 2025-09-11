import { CreateServiceZoneDTO } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";

type CreateFulfillmentSetsStepInput = {
  name: string;
  type: string;
  service_zones: Omit<CreateServiceZoneDTO, "fulfillment_set_id">[];
};

export const createFulfillmentSetsStep = createStep(
  "create-fulfillment-sets",
  async ({ name, type, service_zones }: CreateFulfillmentSetsStepInput, { container }) => {
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
    const existingFulfillmentSet = await fulfillmentModuleService.listFulfillmentSets(
      {
        name: name,
      },
      {
        relations: ["service_zones"],
      }
    );
    if (existingFulfillmentSet.length > 0) {
      return new StepResponse({ fulfillmentSet: existingFulfillmentSet[0] }, { fulfillmentSetId: null });
    }

    const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name,
      type,
      service_zones,
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
