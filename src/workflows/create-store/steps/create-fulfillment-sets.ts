import { CreateServiceZoneDTO } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";

type CreateFulfillmentSetsStepInput = {
  name: string;
  type: string;
  service_zones: Omit<CreateServiceZoneDTO, "fulfillment_set_id">[];
};

export type CreateFulfillmentSetsCompensationInput = {
  fulfillmentSetId?: string;
};

export const createFulfillmentSetsStep = createStep(
  "create-fulfillment-sets",
  async ({ name, type, service_zones }: CreateFulfillmentSetsStepInput, { container }) => {
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);

    const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name,
      type,
      service_zones,
    });

    return new StepResponse({ fulfillmentSet: fulfillmentSet }, { fulfillmentSetId: fulfillmentSet.id });
  },
  async (input: CreateFulfillmentSetsCompensationInput, { container }) => {
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);

    if (input?.fulfillmentSetId) {
      await fulfillmentModuleService.deleteFulfillmentSets([input.fulfillmentSetId]);
    }
  }
);
