import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";

export const retrieveRegionsStep = createStep("retrieve-regions", async (_, { container }) => {
  const regionService = container.resolve(Modules.REGION);

  const existingRegions = await regionService.listRegions();

  if (existingRegions.length > 0) {
    return new StepResponse({ region: existingRegions[0] });
  }
  return new StepResponse({ region: null });
});
