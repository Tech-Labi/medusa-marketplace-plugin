import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";

export const retrieveShippingProfileStep = createStep("retrieve-shippping-profile", async (_, { container }) => {
  const fullfilmentModuleService = container.resolve(Modules.FULFILLMENT);

  const profiles = await fullfilmentModuleService.listShippingProfiles({ name: "Default Shipping Profile" });

  return new StepResponse({ profile: profiles.length > 0 ? profiles[0] : null });
});
