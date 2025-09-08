import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";

export const retrieveShippingOptionsStep = createStep(
  "retrieve-shippping-options",
  async (input: { defaultShippingProfileId: string }, { container }) => {
    const fullfilmentModuleService = container.resolve(Modules.FULFILLMENT);
    const options = await fullfilmentModuleService.listShippingOptions({
      shipping_profile_id: input.defaultShippingProfileId,
    });

    return new StepResponse({ shippingOptions: options.length > 0 ? options[0] : null });
  }
);
